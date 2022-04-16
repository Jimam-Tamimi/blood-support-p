
from importlib.resources import path

from message.apis import MessageViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register('', MessageViewSet) 

urlpatterns = [
    
]  + router.urls
