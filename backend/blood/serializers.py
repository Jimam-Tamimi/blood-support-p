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
    blood_request = BloodRequestSerializer(read_only=True)
    class Meta:
        model = DonorRequest
        fields = "__all__" 

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        bloodRequestId = self.context['request'].data['blood_request']
        try:
            bloodRequest = BloodRequest.objects.get(id=bloodRequestId)
        except BloodRequest.DoesNotExist:
            raise serializers.ValidationError("Blood Request does not exist")
        validated_data['blood_request'] = bloodRequest
        print(self.context['request'].data['blood_request'])
        return super().create(validated_data)
    
    
class DonorRequestReviewSerializer(ModelSerializer):
    class Meta:
        model = DonorRequestReview
        fields = "__all__" 
 
class BloodRequestReviewSerializer(ModelSerializer):
    class Meta:
        model = BloodRequestReview
        fields = "__all__" 
 
    
    

    
    
