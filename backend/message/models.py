from django.db import models
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_save
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db.models import Q
from account.models import Client



# Create your models here.

User = get_user_model()

MESSAGE_STATUS = (
    ("sent", "sent"),
    ("delivered", "delivered"),
    ("seen", "seen"),
    ("removed", "removed"),
)
 

 

class Contact(models.Model):
    users = models.ManyToManyField(User, blank=False, null=False)
    new_message_for = models.ManyToManyField(User, blank=True, null=True, related_name="new_message_for")
    last_messaged = models.DateTimeField(auto_now_add=True)
 

class Message(models.Model):
    def __init__(self, *args, **kwargs):
        super(Message, self).__init__(*args, **kwargs)
        self.Message__original_status = self.status
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE )
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False)
    status = models.CharField(max_length=20, choices=MESSAGE_STATUS,default='sent')
    message = models.TextField(max_length=1000, blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)

@receiver(post_save, sender=Message)
def send_message_update(sender, instance, created, **kwargs): 
    if created:
        for user in instance.contact.users.all():
            if(user != instance.from_user):
                instance.contact.new_message_for.add(user)
        instance.contact.timestamp = instance.timestamp
        instance.contact.save()

    if(instance.status != instance.Message__original_status):
        data = {
            "event": "message_status_update",
            "message_id_server": instance.id,
        }
        channel_layer = get_channel_layer()

        for user in instance.contact.users.all():
            # print(user)
            try:
                user_channel_name = Client.objects.get(user=user, type='MESSAGE')
                data["status"] = instance.status 
                async_to_sync(channel_layer.send)(user_channel_name.channel_name, {
                    "type": 'message.status.update',
                    'payload': data
                })
            except Client.DoesNotExist:
                continue

 
