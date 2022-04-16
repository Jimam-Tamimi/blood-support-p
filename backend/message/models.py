from django.db import models
from django.contrib.auth import get_user_model


# Create your models here.

User = get_user_model()

MESSAGE_STATUS = (
    ("sent", "sent"),
    ("delevered", "delevered"),
    ("seen", "seen"),
    ("removed", "removed"),
)
 

class Contact(models.Model):
    users = models.ManyToManyField(User, blank=False, null=False)
 
 

class Message(models.Model):
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE )
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False)
    status = models.CharField(max_length=20, choices=MESSAGE_STATUS,default='sent')
    message = models.TextField(max_length=1000, blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)