from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from message.models import *

class MessageSerializer(ModelSerializer):
    message_from_me = serializers.SerializerMethodField()
    class Meta:
        model = Message
        fields = "__all__" 
        
    def get_message_from_me(self, obj):
        return obj.from_user == self.context['request'].user
 

class ContactSerializer(ModelSerializer):
    
    class Meta:
        model = Contact
        fields = "__all__" 
   
 