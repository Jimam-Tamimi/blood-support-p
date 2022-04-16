"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

import os
from django.conf.urls import include

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack

from django.urls import path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json
from channels.layers import get_channel_layer
from random import choice
 
from account.routing import ws_pattern as account_ws_pattern
from message.routing import ws_pattern as message_ws_pattern
 
 
 

# application = get_asgi_application()

ws_pattern = [
    path('ws/account/', URLRouter(account_ws_pattern)),
    path('ws/message/', URLRouter(message_ws_pattern)),
]


application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    "websocket": JWTAuthMiddlewareStack(URLRouter(ws_pattern)),
})