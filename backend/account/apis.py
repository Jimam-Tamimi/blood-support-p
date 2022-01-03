from django.db import connections
from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes 


from account.models import *
from .serializers import *
from account.threads import SendEmail
from account.helpers import sendVerificationEmail

# Create your views here.

User = get_user_model()

class UserViewSets(ModelViewSet):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer 

    
    def create(self, request, *args, **kwargs):
        serializer =  self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        print(serializer.data)
        try:
            user = User.objects.get(email=serializer.data['email'])
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        verification = Verification.objects.create(user=user)
        code = verification.code
        data = serializer.data
        refresh = RefreshToken.for_user(user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['success'] = True
        sendVerificationEmail([user.email], code)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers, )
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify(request, code):
    if(request.method == "GET"):
        print(request.user)
        print(request.user.is_authenticated)
 
        try:
            verification = Verification.objects.get(code=code)
        except Verification.DoesNotExist:
            return Response({'success': False, 'error': 'Verification code does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        user = verification.user
        user.email_verified = True
        user.save()    
        verification.delete()
        return Response({"success": True, 'message': 'Email verified', }, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_code(request):
    try:
        email = request.data['email']
    except Exception:
        return Response({'success': False, 'error': 'Email was not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'success': False, 'error': 'Email does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        
    try:
        verification = Verification.objects.get(user=user)
        verification.delete()
    except Verification.DoesNotExist:
        pass
    verification = Verification.objects.create(user=user)
    return Response({"success": True, 'message': 'Verification code sent', }, status=status.HTTP_200_OK)


def vallidateToken(request):
    return Response({"vallied": True, 'message': 'Token is vallied', }, status=status.HTTP_200_OK)