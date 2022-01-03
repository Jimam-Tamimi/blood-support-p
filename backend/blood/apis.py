from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.models import User
from .serializers import *
# Create your views here.



class TestViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = TestSerializer