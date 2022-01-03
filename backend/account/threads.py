import threading
from django.core.mail import send_mail
from django.conf import settings


class SendEmail(threading.Thread):
    def __init__(self, subject:str,message:str , email_list:list ):
        threading.Thread.__init__(self)
        self.subject = subject
        self.message = message
        self.email_list = email_list
        self.email_from = settings.EMAIL_HOST_USER
    
    def run(self):
        send_mail(self.subject, self.message, self.email_from, self.email_list)