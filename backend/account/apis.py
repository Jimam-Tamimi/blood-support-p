import profile
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
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action


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
    

class ProfileViewSet(ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    parser_classes = [FormParser, JSONParser, MultiPartParser]
    
    def create(self, request, *args, **kwargs):
        try:
            Profile.objects.get(user=request.user)
            return Response({'error': 'Profile already exists 😒'}, status=status.HTTP_400_BAD_REQUEST)
        except Profile.DoesNotExist:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response({'error': "Something Went Wrong 😐"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='get-profile-details')
    def get_profile_details(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Profile.DoesNotExist:
            return Response({'error': 'Profile does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception:
            return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify(request, code):
    if(request.method == "GET"): 
        try:
            verification = Verification.objects.get(code=code)
        except Verification.DoesNotExist:
            return Response({'success': False, 'error': 'Verification code does not exist'}, status=status.HTTP_404_NOT_FOUND)
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