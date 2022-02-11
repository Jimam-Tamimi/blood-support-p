from typing_extensions import Required
from django.db.models import fields
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model


from account.models import *

User = get_user_model()


class UserSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    cpassword = serializers.CharField(required=True, write_only=True)
    class Meta:
        model = User
        fields = [ "id", "email", "password", "cpassword"]  
        
    
    def create(self, validated_data): 
        email = validated_data['email']
        password = validated_data['password']
        cpassword = validated_data['cpassword']
        if email == '':
            raise ValidationError("Email is required")
        if(password != cpassword):
            raise ValidationError("Passwords do not match")
         
        if(len(password) < 4):
            raise ValidationError("Password must be at least 4 characters")
         
        user = User.objects.create(email=email)
        user.set_password(password)
        user.save()
        return user
        
class ProfileSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = "__all__"
    
    

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
    
    
 