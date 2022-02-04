from django.db import models
from django.contrib.auth import get_user_model

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
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, blank=False, null=False)
    date_time = models.DateTimeField(blank=False, null=False)
    number = models.CharField(max_length=30, blank=False, null=False)
    add_number = models.CharField(max_length=30, blank=False, null=False)
    blood_group = models.CharField(max_length=30, blank=False, null=False, choices=BLOOD_GROUP_CHOICES)
    location = models.JSONField(blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)
