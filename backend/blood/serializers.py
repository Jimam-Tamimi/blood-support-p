from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import *
from account.serializers import UserSerializer

class BloodRequestSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)
    class Meta:
        model = BloodRequest
        fields = "__all__" 
        
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

class DonorRequestSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)

    class Meta:
        model = DonorRequest
        fields = "__all__" 

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
    
    