from django.conf import settings




from account.threads import SendEmail



def sendVerificationEmail(email_list:list, code:str): 
    subject = "Your email needs to be verified"
    message = f'Click on the verification link to verify your email: {settings.BASE_URL}/email/verification/{code}/'
    SendEmail(subject, message, email_list).start()