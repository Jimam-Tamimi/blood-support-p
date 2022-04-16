
from django.urls import path
from message.consumers import *


ws_pattern = [
    path('', MessageConsumer.as_asgi()),
]
