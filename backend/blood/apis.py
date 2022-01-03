from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from .serializers import *
# Create your views here.

User = get_user_model()
 