from time import time, sleep
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from .serializers import *
from .models import *
# Create your views here.

User = get_user_model()
 
 
class BloodRequestViewSet(ModelViewSet):
    queryset = BloodRequest.objects.all()
    serializer_class = BloodRequestSerializer
    lookup_field = 'slug' 
