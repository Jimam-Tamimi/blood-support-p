from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.template.defaultfilters import slugify
from blood.helpers import generate_slug

from blood.helpers import random_string_generator

User = get_user_model()

# Create your models here.
BLOOD_GROUP_CHOICES = (
    ("A+", "A+"),
    ("B+", "B+"),
    ("AB+", "AB+"),
    ("O+", "O+"), 
    ("A-", "A-"),
    ("B-", "B-"),
    ("AB-", "AB-"),
    ("O-", "O-"), 
)




class BloodRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    slug = models.SlugField(max_length=100, unique=True, blank=True, null=True) 
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, blank=False, null=False)
    date_time = models.DateTimeField(blank=False, null=False)
    number = models.CharField(max_length=30, blank=False, null=False)
    add_number = models.CharField(max_length=30, blank=False, null=False)
    blood_group = models.CharField(max_length=30, blank=False, null=False, choices=BLOOD_GROUP_CHOICES)
    location = models.JSONField(blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    
@receiver(pre_save, sender=BloodRequest)
def create_profile(sender, instance, **kwargs):
    if(not instance.slug):
        blood_group = instance.blood_group
        blood_group_slug = blood_group + ' positive' if blood_group.endswith("+")  else " negative"
        instance.slug =  generate_slug(f"{blood_group_slug} blood request by {instance.name}", sender)