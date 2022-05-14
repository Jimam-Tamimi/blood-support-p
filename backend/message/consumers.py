import contextlib
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from account.models import Client
from message.models import *
from django.contrib.auth import get_user_model
User = get_user_model()


class MessageConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        user_channel_names = await database_sync_to_async(Client.objects.filter)(user=self.scope["user"],  type='MESSAGE')
        user_channel_names = await get_all_user_channel_names(user_channel_names)
        for c in user_channel_names:
            await database_sync_to_async(c.delete)()
        await database_sync_to_async(Client.objects.create)(channel_name=self.channel_name, user=self.scope["user"],  type='MESSAGE')
        await self.accept()

    async def receive_json(self, content, **kwargs):
        if (content['event'] == 'send_message'):
            try:
                contact = await database_sync_to_async(Contact.objects.get)(id=content['contact_id'])
            except Contact.DoesNotExist:
                await self.send_json({'success': 'false', 'error': 'Contact does not exist', 'error_code': 'contact_does_not_exist', "message_id_client": content["message_id_client"]})

            message = await database_sync_to_async(Message.objects.create)(contact=contact, from_user=self.scope["user"], message=content['message'])
            contact_users = await database_sync_to_async(contact.users.all)()
            data = {'event': 'message_send_success', 'success': 'true', 'message': message.message, "status": message.status, 'message_id_server': message.id, 'contact': message.contact.id, 'from_user': message.from_user.id, 'message_id_client': content["message_id_client"], "message_from_user": False}

            for user in await (get_all_users)(contact):
                if(user != self.scope["user"]):
                    try:
                        
                        user_channel_name = await database_sync_to_async(Client.objects.get)(user=user, type='MESSAGE')
                        new_messages = await database_sync_to_async(Contact.objects.filter)(users=user, new_message_for=user)
                        data['new_message_count']  =  len(await queryset_to_list(new_messages))
                        await self.channel_layer.send(user_channel_name.channel_name, {
                            "type": 'message.send',
                            'payload': data
                        })
                        message.status = "delivered"
                        await database_sync_to_async(message.save)()
                        oldMessages = await database_sync_to_async(Message.objects.filter)(status="sent", contact=message.contact)
                        for msg in await queryset_to_list(oldMessages):
                            msg.status = "delivered"
                            await database_sync_to_async(msg.save)()
                    except Client.DoesNotExist:
                        continue

            data['message_from_user'] = True
            await self.send_json(data)

        elif(content['event'] == 'update_message_status'):
            message = await database_sync_to_async(Message.objects.get)(id=content['message_id'])

            if(message.status != content['status']):
                message.status = content['status']
                await database_sync_to_async(message.save)()

            if(content['status'] == "delivered"):
                messages = await database_sync_to_async(Message.objects.filter)(status="sent", contact=message.contact)
                for msg in await queryset_to_list(messages):
                    msg.status = "delivered"
                    await database_sync_to_async(msg.save)()

            elif(content['status'] == "seen"):
                messages = await get_not_seen_message_to_list(message)
                for msg in await queryset_to_list(messages):
                    msg.status = "seen"
                    await database_sync_to_async(msg.save)()
                
                await database_sync_to_async(message.contact.new_message_for.remove)(self.scope["user"])
                await database_sync_to_async(message.contact.save)()
                

    async def disconnect(self, code):
        with contextlib.suppress(Client.DoesNotExist):
            user_channel_names = await database_sync_to_async(Client.objects.filter)(user=self.scope["user"], type='MESSAGE')
            user_channel_names = await get_all_user_channel_names(user_channel_names)
            for c in user_channel_names:
                await database_sync_to_async(c.delete)()
        return await super().disconnect(code)

    async def message_send(self, event):
        await self.send_json(event['payload'])

    async def message_status_update(self, event):
        await self.send_json(event['payload'])


@sync_to_async
def get_all_users(contact):
    return list(contact.users.all())


@sync_to_async
def get_all_user_channel_names(user_channel_names):
    return list(user_channel_names)


@sync_to_async
def queryset_to_list(queryset):
    return list(queryset)


@sync_to_async
def get_not_seen_message_to_list(message):
    return list(Message.objects.filter(~Q(status="seen"), contact=message.contact))
