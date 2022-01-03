from django.urls import path
from .apis import *
from rest_framework import routers

router = routers.DefaultRouter()
 

urlpatterns = [
    # path('', ),
    
] + router.urls
