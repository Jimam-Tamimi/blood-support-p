
from django.urls import path
from account.consumers import *


ws_pattern = [
    path('users/', UserConsumer.as_asgi()),
]
