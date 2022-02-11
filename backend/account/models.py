from typing import Optional
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import uuid


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
        if(self.profile_img  and  self.name  and  self.blood_group  and  self.address  and  self.number  and  self.add_number  and  self.location):
            self.isCompleted = True
        else:
            self.isCompleted = False
            
        super(Profile, self).save(*args, **kwargs)
    
    
class Verification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False)
    code = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    