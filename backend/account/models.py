from typing import Optional
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import uuid
import geopy.distance


# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **other_fields):
        
        if not email:
            raise ValueError('Users must have an email address')
        
        user = self.model(email=email, **other_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **other_fields):
        user = self.create_user(email, password, **other_fields)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user

7
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True, blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    email_verified = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    is_supperuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    objects = CustomUserManager()
    
    def __str__(self):
        return self.email   
    

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    profile_img = models.ImageField(upload_to='profile_imgs', blank=True, null=True)
    name = models.CharField(max_length=20, blank=False, null=False)
    email = models.EmailField(max_length=100, unique=False, blank=False, null=False)
    blood_group = models.CharField(max_length=5, blank=False, null=False)
    address = models.CharField(max_length=300, blank=False, null=False)
    number = models.CharField(max_length=25, blank=False, null=False)
    add_number = models.CharField(max_length=25, blank=False, null=False)
    location = models.JSONField(blank=False, null=False)
    isCompleted = models.BooleanField(default=False)
    description = models.TextField(blank=False, null=False)
    def save(self, *args, **kwargs):
        print('save() is called.')
        self.isCompleted = bool((self.profile_img and self.name and self.blood_group and self.address and self.number and self.add_number and self.location))

        super(Profile, self).save(*args, **kwargs)
    
    def distance_from_user(self, user):
        try:
            userProfile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            return None
        
        coords_1 = (userProfile.location['lat'], userProfile.location['lng'])
        coords_2 = (self.location['lat'], self.location['lng'])
        return geopy.distance.distance(coords_1, coords_2).km
    
    def distance_from(self, location):
        
        coords_1 = (location['lat'], location['lng'])
        coords_2 = (self.location['lat'], self.location['lng'])
        return geopy.distance.distance(coords_1, coords_2).km
    
class Verification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False)
    code = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)


# report 
       
class UserReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_reported")
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_reporter")
    description = models.TextField(max_length=500, blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    

class FavoriteUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
    favorite_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorite_user")
    timestamp = models.DateTimeField(auto_now_add=True)



    
Client_TYPES = (
    ("MESSAGE", "MESSAGE"),
    ("NOTIFICATION", "NOTIFICATION"),
    ("USER", "USER"), 
)
class Client(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False)
    type = models.CharField(max_length=200, blank=False, null=False ,choices=Client_TYPES)
    channel_name = models.CharField(max_length=256, blank=False, null=False)
    

class UserData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False, unique=True)
    new_messages_count = models.IntegerField(default=0)
        
    