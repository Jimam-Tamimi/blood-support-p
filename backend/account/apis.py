import contextlib
import profile
import time
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
from rest_framework.authentication import SessionAuthentication
from rest_framework.pagination import PageNumberPagination

from account.models import *
from account.filters import ProfileFilter
from blood.models import Notification
from .serializers import *
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
    
        
    @action(detail=True, methods=['post'], url_path='report')
    def report(self, request, pk=None):
        reported_user = self.get_object()
        if(reported_user == request.user):
            return Response({'success': False, 'error': 'You cannot report your self'}, status=status.HTTP_400_BAD_REQUEST)
 
        if(UserReport.objects.filter(user=reported_user, reported_by=request.user).exists()):
            return Response({'success': False, 'error': 'You have already reported this user'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            UserReport.objects.create(user=reported_user, reported_by=request.user, description=request.data['description'])
        except Exception:
            return Response({'success': False, 'error': 'Something went wrong. Please try again'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'success': True, 'message': 'You have reported this user. We will review it soon'}, status=status.HTTP_200_OK)
 

    @action(detail=False, methods=['get', 'post', 'delete'], url_path='favorites')
    def favorites(self, request):
        if (request.method == 'GET'):
            favUsers = FavoriteUser.objects.filter(user=request.user)
            wanted_profiles = set()
            for user in favUsers:
                with contextlib.suppress(Profile.DoesNotExist):
                    profile = Profile.objects.get(user=user.favorite_user)
                wanted_profiles.add(profile.id) 
            profiles = Profile.objects.filter(id__in=wanted_profiles)
            profiles = ProfileFilter(request.GET, queryset=profiles).qs
            return Response(ProfileSerializer(profiles, many=True, context={'request': request}).data, status=status.HTTP_200_OK)

        elif(request.method == 'POST'):
            try:
                user = User.objects.get(id=request.data['user_id'])

            except User.DoesNotExist:
                return Response({'success': False, 'error': 'User request not found'}, status=status.HTTP_400_BAD_REQUEST)

            if(FavoriteUser.objects.filter(user=request.user, favorite_user=user).exists()):
                return Response({'success': False, 'error': 'You have already added this user to your favorites list'}, status=status.HTTP_400_BAD_REQUEST)

            FavoriteUser.objects.create(user=request.user, favorite_user=user)
            return Response({'success': True, 'message': 'User added to your favorites list 🙂'}, status=status.HTTP_201_CREATED)

        elif(request.method == "DELETE"):
            try:
                user = User.objects.get(id=request.data['user_id'])
            except FavoriteUser.DoesNotExist:
                return Response({'success': False, 'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                FavoriteUser.objects.get(user=request.user, favorite_user=user).delete()
            except FavoriteUser.DoesNotExist:
                return Response({'success': False, 'error': 'User not found in your favorites list'}, status=status.HTTP_400_BAD_REQUEST)

            except Exception:
                return Response({'success': False, 'error': 'Something went wrong. Please try again'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'success': True, 'message': 'User request removed from your favorites list 🙂'}, status=status.HTTP_204_NO_CONTENT)
 
    

class ProfileViewSet(ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    parser_classes = [FormParser, JSONParser, MultiPartParser]
    # authentication_classes = [BasicAuthentication]
    def create(self, request, *args, **kwargs):
        try:
            Profile.objects.get(user=request.user)
            return Response({'error': 'Profile already exists 😒'}, status=status.HTTP_400_BAD_REQUEST)
        except Profile.DoesNotExist:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response({'error': "Something Went Wrong 😐"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='get-my-profile-details')
    def get_profile_details(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Profile.DoesNotExist:
            return Response({'error': 'Profile does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception:
            return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='get-profile-details-for-user')
    def get_profile_details_by_user(self, request):
        try:
            User.objects.get(id=request.GET['user_id'])
        except User.DoesNotExist:
            return Response({'status': False,  'error': 'User with this id does not exist', 'code': 'user_not_found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            profile = Profile.objects.get(user__id=request.GET['user_id'])
            serializer = self.get_serializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({'status': False,  'error': 'Profile with this user does not exist', 'code': 'profile_not_found'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception:
            return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
    
    

class NotificationPagination(PageNumberPagination):       
       page_size = 15
class NotificationsSets(ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    authorization_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = NotificationPagination 
    
    def create(self, request, *args, **kwargs):
        return Response({'success': False, 'error': 'Not authorized'}, status=status.HTTP_401_UNAUTHORIZED)
    def list(self, request, *args, **kwargs):
        if request.user.is_staff:
            return super().list(request, *args, **kwargs)
        notifications = Notification.objects.filter(user=request.user).order_by('-id')
        # notifications = Notification.objects.all()        
        paginated_notifications = self.paginate_queryset(notifications)
        serialized_data = self.get_serializer(paginated_notifications, many=True).data
        # time.sleep(   5)
        return self.get_paginated_response(serialized_data, )
            
    
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