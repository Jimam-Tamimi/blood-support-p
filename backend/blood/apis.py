from time import time, sleep
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from rest_framework.response  import Response
from rest_framework import status
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
    queryset = DonorRequest.objects.all()
    serializer_class = DonorRequestSerializer 

    def create(self, request, *args, **kwargs):
        if DonorRequest.objects.filter(blood_request=request.data['blood_request'], user=request.user).exists():
            return Response({'success': False, 'error': 'You have already sent a donor request'}, status=status.HTTP_400_BAD_REQUEST)
            
        if(BloodRequest.objects.filter(id=request.data['blood_request'], user=request.user).exists()):
            return Response({'success': False, 'error': 'You can\'t send a donor request to your own blood request'}, status=status.HTTP_400_BAD_REQUEST) 
        return super().create(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'], url_path='get-my-donor-request')
    def getMyDonorRequest(self, request):
        try:
            bloodRequest = BloodRequest.objects.get(id=request.GET['bloodRequestId'])
        except BloodRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Blood request does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            donorRequest = DonorRequest.objects.get(blood_request=bloodRequest, user=request.user)
            return Response(DonorRequestSerializer(donorRequest).data, status=status.HTTP_200_OK)
        except DonorRequest.DoesNotExist:
            return Response({'success': False, 'error': 'You have not sent any donor request'}, status=status.HTTP_404_NOT_FOUND)