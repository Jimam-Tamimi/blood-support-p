from channels.generic.websocket import AsyncJsonWebsocketConsumer

class UserConsumer(AsyncJsonWebsocketConsumer):
    
    async def connect(self):
        await self.accept()

    async def receive_json(self, content, **kwargs):
        await self.send_json(content)
    
    async def disconnect(self, code):
        return await super().disconnect(code)