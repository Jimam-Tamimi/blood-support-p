from django.urls import path
from .apis import *
from rest_framework import routers

router = routers.DefaultRouter()
router.register('blood-request', BloodRequestViewSet)

urlpatterns = [
    # path('', ),
    
] + router.urls
