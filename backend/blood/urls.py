from django.urls import path
from .apis import *
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'users', TestViewSet)

urlpatterns = [
    # path('', ),
    
] + router.urls
