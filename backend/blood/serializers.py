from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import *
from account.serializers import UserSerializer

class BloodRequestSerializer(ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    timestamp = serializers.DateTimeField(read_only=True)
    class Meta:
        model = BloodRequest
        fields = "__all__"