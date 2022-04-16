from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from message.models import *

class MessageConsumer(AsyncJsonWebsocketConsumer):
    
    async def connect(self):
        await self.accept()

    async def receive_json(self, content, **kwargs):
        print(content)
        if(content['event'] == 'send_message'):
            try:
                contact = await database_sync_to_async(Contact.objects.get)(id=content['contact_id'])
            except Contact.DoesNotExist:
                await self.send_json({'success': 'false', 'error': 'Contact does not exist', 'error_code': 'contact_does_not_exist', "message_id_client": content["message_id_client"]})
            message = await database_sync_to_async(Message.objects.create)(contact=contact, from_user=self.scope["user"], message=content['message'])
            await self.send_json({'success': 'true', 'message': 'Message sent', 'message_id_client': content["message_id_client"], 'message_id_server': message.id})
    
    async def disconnect(self, code):
        return await super().disconnect(code)