from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from account.serializers import ProfileSerializer
from .models import *
from account.models import Profile
from account.serializers import UserSerializer

class BloodRequestSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)
    donor_request_got = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()
    is_reported = serializers.SerializerMethodField()
    
    class Meta:
        model = BloodRequest
        fields = "__all__" 
        
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

        
    def get_donor_request_got(self, obj):
        return DonorRequest.objects.filter(blood_request=obj).count()
        
    def get_is_favorite(self, obj):
        return FavoriteBloodRequest.objects.filter(user=self.context['request'].user, blood_request=obj).exists()
        
    def get_is_reported(self, obj):
        return BloodRequestReport.objects.filter(reported_by=self.context['request'].user, blood_request=obj).exists()
        

class DonorRequestSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)
    blood_request = BloodRequestSerializer(read_only=True)
    profile = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()
    is_reported = serializers.SerializerMethodField()
    class Meta:
        model = DonorRequest
        fields = "__all__" 

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        bloodRequestId = self.context['request'].data['blood_request']
        try:
            bloodRequest = BloodRequest.objects.get(id=bloodRequestId)
        except BloodRequest.DoesNotExist as e:
            raise serializers.ValidationError("Blood Request does not exist") from e
        validated_data['blood_request'] = bloodRequest
        print(self.context['request'].data['blood_request'])
        return super().create(validated_data)

    def get_profile(self, obj):
        return ProfileSerializer(Profile.objects.get(user=obj.user)).data
    
    def get_is_favorite(self, obj):
        return FavoriteDonorRequest.objects.filter(user=self.context['request'].user, donor_request=obj).exists()
        
    def get_is_reported(self, obj):
        return DonorRequestReport.objects.filter(reported_by=self.context['request'].user, donor_request=obj).exists()
        

    # def get_donor_request_got(self, obj):
    #     return Profile.objects.get(user=obj.user)
    
class DonorRequestReviewSerializer(ModelSerializer):
    class Meta:
        model = DonorRequestReview
        fields = "__all__" 
 
class BloodRequestReviewSerializer(ModelSerializer):
    class Meta:
        model = BloodRequestReview
        fields = "__all__" 
 
    
    

    
    
