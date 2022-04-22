
from django.urls import path
from blood.consumers import *


ws_pattern = [
    path('', NotificationConsumer.as_asgi()),
]
