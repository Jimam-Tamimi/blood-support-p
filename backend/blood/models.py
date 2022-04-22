from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.template.defaultfilters import slugify

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
    status = models.CharField(max_length=30, blank=False, null=False, default="Open", choices=(("Open", "Open"), ("Accepted", "Accepted"), ("Reviewed By Requestor", "Reviewed By Requestor"),  ("Completed", "Completed"), ("Expired", "Expired") ))
    description = models.TextField(max_length=500, blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    
     
     
class DonorRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    blood_request = models.ForeignKey(BloodRequest, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, blank=False, null=False)
    date_time = models.DateTimeField(blank=False, null=False)
    number = models.CharField(max_length=30, blank=False, null=False)
    add_number = models.CharField(max_length=30, blank=False, null=False)
    address = models.CharField(max_length=100, blank=False, null=False)
    description = models.TextField(max_length=500, blank=False, null=False)
    location = models.JSONField(blank=False, null=False)
    status = models.CharField(max_length=30, blank=False, null=False, default="Pending", choices=(("Pending", "Pending"), ("Accepted", "Accepted"), ("Reviewed", "Reviewed"), ("Rejected", "Rejected") ))
    timestamp = models.DateTimeField(auto_now_add=True)

    def get_donor_request_users_for_blood_request(self, bloodRequest):
        for donorRequest in self.objects.filter(blood_request=bloodRequest):
            yield donorRequest.user
     

class DonorRequestReview(models.Model):
    donor_request = models.OneToOneField(DonorRequest, on_delete=models.CASCADE, unique=True)
    rating = models.FloatField(blank=False, null=False)
    description = models.TextField(max_length=500, blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    

    
class BloodRequestReview(models.Model):
    blood_request = models.OneToOneField(BloodRequest, on_delete=models.CASCADE, unique=True)
    rating = models.FloatField(blank=False, null=False)
    description = models.TextField(max_length=500, blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)
 
 
# reports 
class BloodRequestReport(models.Model):
    blood_request = models.ForeignKey(BloodRequest, on_delete=models.CASCADE)
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(max_length=500, blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    
        
class DonorRequestReport(models.Model):
    donor_request = models.ForeignKey(DonorRequest, on_delete=models.CASCADE)
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(max_length=500, blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    
        
 
    

class FavoriteBloodRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    blood_request = models.ForeignKey(BloodRequest, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    

class FavoriteDonorRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    donor_request = models.ForeignKey(DonorRequest, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


NOTIFICATION_TYPE_CHOICES = (
    ("NEW_BLOOD_REQUEST", "NEW_BLOOD_REQUEST"),  #done
    ("DONOR_REQUEST_GOT", "DONOR_REQUEST_GOT"), #done
    ("BLOOD_REQUEST_UPDATED", "BLOOD_REQUEST_UPDATED"),  #done 
    ("BLOOD_REQUEST_DELETED", "BLOOD_REQUEST_DELETED"), #done
    ("DONOR_REQUEST_ACCEPTED", "DONOR_REQUEST_ACCEPTED"), 
    ("DONOR_REQUEST_NOT_ACCEPTED", "DONOR_REQUEST_NOT_ACCEPTED"), 
    ("DONOR_REQUEST_REJECTED", "DONOR_REQUEST_REJECTED"), 
    ("DONOR_REQUEST_RESTORED", "DONOR_REQUEST_RESTORED"), 
    ("DONOR_REQUEST_DELETED", "DONOR_REQUEST_DELETED"), #done
    ("DONOR_REQUEST_UPDATED", "DONOR_REQUEST_UPDATED"), #done
    ("DONOR_REQUEST_REVIEWED", "DONOR_REQUEST_REVIEWED"), 
    ("BLOOD_REQUEST_REVIEWED", "BLOOD_REQUEST_REVIEWED"), 
)


class NotificationData(models.Model):
    type = models.CharField(max_length=300, blank=False, null=False, choices=NOTIFICATION_TYPE_CHOICES)
    data = models.JSONField(blank=False, null=False) 
    timestamp = models.DateTimeField(auto_now_add=True)
    


class Notification(models.Model):
    notification_data = models.ForeignKey(NotificationData, on_delete=models.CASCADE, blank=False, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def create_for_users(self, users, notification_data):
        for user in users:
            self.objects.create(user=user, notification_data=notification_data)

