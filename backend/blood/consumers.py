import contextlib
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from account.models import Client
from message.models import *
from django.contrib.auth import get_user_model
User = get_user_model()


class NotificationConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        user_channel_names = await database_sync_to_async(Client.objects.filter)(user=self.scope["user"],  type='NOTIFICATION')
        user_channel_names = await get_all_user_channel_names(user_channel_names)
        for c in user_channel_names:
            await database_sync_to_async(c.delete)()
        await database_sync_to_async(Client.objects.create)(channel_name=self.channel_name, user=self.scope["user"],  type='NOTIFICATION')
        await self.accept()

    async def receive_json(self, content, **kwargs):
        pass

    async def disconnect(self, code):
        with contextlib.suppress(Client.DoesNotExist):
            user_channel_names = await database_sync_to_async(Client.objects.filter)(user=self.scope["user"], type='NOTIFICATION')
            user_channel_names = await get_all_user_channel_names(user_channel_names)
            for c in user_channel_names:
                await database_sync_to_async(c.delete)()
        return await super().disconnect(code)

    async def notification_send(self, event):
        print(event)
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
 