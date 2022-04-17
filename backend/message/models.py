from django.db import models
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_save
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db.models import Q



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
    # print(sender)
    # print(instance)
    # print(created)
    # print(kwargs)
    print(instance.status)
    print(instance.Message__original_status)
    
    if not created:
        if(instance.status != instance.Message__original_status):
            data = {
                "event": "message_status_update",
                "message_id_server": instance.id,
            }
            channel_layer = get_channel_layer()
            
            for user in instance.contact.users.all():
                print(user)
                try:
                    user_channel_name = MessageClient.objects.get(user=user)
                    data["status"] = instance.status 
                    async_to_sync(channel_layer.send)(user_channel_name.channel_name, {
                        "type": 'message.status.update',
                        'payload': data
                    })
                except MessageClient.DoesNotExist:
                    continue

            oldMessages = Message.objects.filter(~Q(status=instance.status))
            print(oldMessages)
            for msg in oldMessages:
                msg.status = instance.status
                msg.save()

    
    
class MessageClient(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False)
    channel_name = models.CharField(max_length=256, blank=False, null=False)
    