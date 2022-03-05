from time import time, sleep
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from rest_framework.response  import Response
from rest_framework import status

from django.db.models import Q

# from rest_framework.permissions import 

from account.models import Profile
from account.serializers import ProfileSerializer
from .serializers import *
from .models import *


# Create your views here.

User = get_user_model()
 
 
class BloodRequestViewSet(ModelViewSet):
    queryset = BloodRequest.objects.all()
    serializer_class = BloodRequestSerializer 
    @action(detail=True, methods=['get'], url_path='have-sent-donor-request')
    def haveSentDonorRequest(self, request, pk=None):
        blood_request = self.get_object()
        if DonorRequest.objects.filter(blood_request=blood_request.id, user=request.user).exists():
            return Response({'success': True, 'message': 'You have already sent a donor request', "haveSentDonorRequest" : True}, status=status.HTTP_200_OK)
        else:
            return Response({'success': True, 'message': 'You haven\'t sent any donor request', "haveSentDonorRequest" : False}, status=status.HTTP_200_OK)
            
 
class DonorRequestViewSet(ModelViewSet):
    queryset = DonorRequest.objects.all().order_by('-timestamp')
    serializer_class = DonorRequestSerializer 
     

    def list(self, request, *args, **kwargs):
        if(request.user.is_admin):
            return super().list(request, *args, **kwargs)
        else:
            return Response({'success': False, 'error': 'You are not authorized to view this page'}, status=status.HTTP_401_UNAUTHORIZED)
    
    

    def create(self, request, *args, **kwargs):
        try:
            if(not Profile.objects.get(user=request.user).isCompleted):
                return Response({'success': False, 'message': 'You must complete your profile before sending a donor request'}, status=status.HTTP_400_BAD_REQUEST)
        except Profile.DoesNotExist:
            return Response({'success': False, 'message': 'You must complete your profile before sending a donor request'}, status=status.HTTP_400_BAD_REQUEST)
            
        
        if DonorRequest.objects.filter(blood_request=request.data['blood_request'], user=request.user).exists():
            return Response({'success': False, 'error': 'You have already sent a donor request'}, status=status.HTTP_400_BAD_REQUEST)
            
        if(BloodRequest.objects.filter(id=request.data['blood_request'], user=request.user).exists()):
            return Response({'success': False, 'error': 'You can\'t send a donor request to your own blood request'}, status=status.HTTP_400_BAD_REQUEST) 
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if(request.user.is_staff):
            return super().update(request, *args, **kwargs)
        donorRequest = self.get_object()
        if(donorRequest.user == request.user):
            if(donorRequest.status == 'Pending'):
                return super().update(request, *args, **kwargs)
            else:
                return Response({'success': False, 'error': 'You can not update this request right now'}, status=status.HTTP_400_BAD_REQUEST)
                
        else:
            return Response({'success': False, 'error': 'You are not authorized to update this donor request 😒'}, status=status.HTTP_401_UNAUTHORIZED)
    def partial_update(self, request, *args, **kwargs):
        if(request.user.is_staff):
            return super().partial_update(request, *args, **kwargs)
        donorRequest = self.get_object()
        if(donorRequest.user == request.user):
            if(donorRequest.status == 'Pending'):
                return super().partial_update(request, *args, **kwargs)
            else:
                return Response({'success': False, 'error': 'You can not update this request right now'}, status=status.HTTP_400_BAD_REQUEST)
                
        else:
            return Response({'success': False, 'error': 'You are not authorized to update this donor request 😒'}, status=status.HTTP_401_UNAUTHORIZED)
    def destroy(self, request, *args, **kwargs):
        if(request.user.is_staff):
            return super().destroy(request, *args, **kwargs)
        donorRequest = self.get_object()
        if(donorRequest.user == request.user):
            if(donorRequest.status == 'Pending'):
                return super().destroy(request, *args, **kwargs)
            else:
                return Response({'success': False, 'error': 'You can not delete this request right now'}, status=status.HTTP_400_BAD_REQUEST)
                
        else:
            return Response({'success': False, 'error': 'You are not authorized to delete this donor request 😒'}, status=status.HTTP_401_UNAUTHORIZED) 
        
    @action(detail=False, methods=['get'], url_path='get-my-donor-request-for-blood-request')
    def getMyDonorRequestForBloodRequest(self, request):
        try:
            bloodRequest = BloodRequest.objects.get(id=request.GET['bloodRequestId'])
        except BloodRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Blood request does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            donorRequest = DonorRequest.objects.get(blood_request=bloodRequest, user=request.user)
            return Response(DonorRequestSerializer(donorRequest).data, status=status.HTTP_200_OK)
        except DonorRequest.DoesNotExist:
            return Response({'success': False, 'error': 'You have not sent any donor request'}, status=status.HTTP_404_NOT_FOUND)

    
    @action(detail=False, methods=['get'], url_path='get-donor-requests-for-my-blood-request')
    def getDonorRequestsForMyBloodRequest(self, request):
        try:
            bloodRequest = BloodRequest.objects.get(id=request.GET['blood_request_id'])
        except BloodRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Blood request does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        donorRequests = DonorRequest.objects.filter(blood_request=bloodRequest).order_by('-timestamp')
        donorRequests = donorRequests.filter(~Q(status="Rejected"))
        data = DonorRequestSerializer(donorRequests, many=True).data
        for d in data:
            print(d['user']['id'])
            try:
                profile = Profile.objects.get(user=d['user']['id'])
                if(profile.isCompleted):
                    d['profile'] = ProfileSerializer(profile).data
                else:
                    data.remove(d)
            except Profile.DoesNotExist:
                data.remove(d)
        
        return Response(data, status=status.HTTP_200_OK) 
    
    
    @action(detail=False, methods=['post'], url_path='accept-donor-request')
    def acceptDonorRequest(self, request):
        try:
            donorRequest = DonorRequest.objects.get(id=request.data['donor_request_id'])
            if(donorRequest.blood_request.user != request.user):
                return Response({'success': False, 'error': 'You are not authorized to accept this donor request 😑'}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                if(donorRequest.blood_request.status == 'accepted'):
                    return Response({'success': False, 'error': 'You can\'t accept more than one donor request 😒'}, status=status.HTTP_400_BAD_REQUEST)
                if(donorRequest.status == 'Accepted'):
                    return Response({'success': False, 'error': 'You have already accepted this donor request 😒'}, status=status.HTTP_400_BAD_REQUEST)
                for dr in DonorRequest.objects.filter(blood_request=donorRequest.blood_request):
                    if(dr.status == 'Accepted'):
                        return Response({'success': False, 'error': 'You can\'t accept more than one donor request 😒'}, status=status.HTTP_400_BAD_REQUEST)
                    
                donorRequest.status = 'Accepted'
                donorRequest.save()
                donorRequest.blood_request.status = 'Accepted'
                donorRequest.blood_request.save()
                return Response(DonorRequestSerializer(donorRequest).data, status=status.HTTP_200_OK)
        except DonorRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Donor request does not exist 😒'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception:
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='reject-donor-request')
    def acceptDonorRequest(self, request):
        try:
            donorRequest = DonorRequest.objects.get(id=request.data['donor_request_id'])
            if(donorRequest.blood_request.user != request.user):
                return Response({'success': False, 'error': 'You are not authorized to reject this donor request 😑'}, status=status.HTTP_401_UNAUTHORIZED)
            if(donorRequest.status == 'Rejected'):
                return Response({'success': False, 'error': 'You have already rejected this donor request 😒'}, status=status.HTTP_400_BAD_REQUEST)
                
            donorRequest.status = 'Rejected'
            donorRequest.save() 
            return Response(DonorRequestSerializer(donorRequest).data, status=status.HTTP_200_OK)
        except DonorRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Donor request does not exist 😒'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception:
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)