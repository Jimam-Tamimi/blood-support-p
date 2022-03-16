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
            
    @action(detail=True, methods=['get'], url_path='get-total-donor-requests-for-blood-request')
    def getTotalDonorRequestsForBloodRequest(self, request, pk=None):
        try:
            bloodRequest = BloodRequest.objects.get(id=pk)
        except BloodRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Blood request does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            print(e)
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)
            
        
        donorRequests = DonorRequest.objects.filter(blood_request=bloodRequest).order_by('-timestamp')
        donorRequests = donorRequests.filter(~Q(status="Rejected")) 
        return Response({"total": len(donorRequests)}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='review-donor-for-blood-request')
    def reviewDonorForBloodRequest(self, request, pk=None):
        try:
            bloodRequest = BloodRequest.objects.get(id=pk)
        except BloodRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Blood request does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            rating = request.data['rating']
            description = request.data['description']
        except Exception as e:
            print(type(e))
            e = str(e).replace("\'", "").capitalize()
            return Response({'success': False, 'error':  f'{e} is required 😒'}, status=status.HTTP_400_BAD_REQUEST)
        if(bloodRequest.user == request.user):
            if(bloodRequest.status == 'Accepted'):
                donorRequests = DonorRequest.objects.filter(blood_request=bloodRequest)
                for dReq in donorRequests:
                    if(dReq.status == 'Accepted'):
                        dReq.status = 'Reviewed'
                        dReq.save()
                        try:
                            DonorRequestReview.objects.create(donor_request=dReq, rating=rating, description=description) 
                        except Exception as e:
                            pass
                bloodRequest.status = 'Completed'
                bloodRequest.save()

                        
                return Response({'success': True, 'message': 'You have submitted your feedback. Please wait for the donor to give his feedback. 😀'}, status=status.HTTP_200_OK)
            else:
                return Response({'success': False, 'error': 'You can only review accepted donor request'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'success': False, 'error': 'You are not authorized review this donor for this blood request 😒'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=True, methods=['post'], url_path='review-blood-requestor-for-blood-request')
    def reviewBloodRequestorForBloodRequest(self, request, pk=None):
        try:
            bloodRequest = BloodRequest.objects.get(id=pk)
        except BloodRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Blood request does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            rating = request.data['rating']
            description = request.data['description']
        except Exception as e:
            print(type(e))
            e = str(e).replace("\'", "").capitalize()
            return Response({'success': False, 'error':  f'{e} is required 😒'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            donorRequest = DonorRequest.objects.get(blood_request=bloodRequest, user=request.user)
        except BloodRequest.DoesNotExist:
            return Response({'success': False, 'error': 'You haven\'t sent any donor request to this blood request'}, status=status.HTTP_401_UNAUTHORIZED)
        if(donorRequest.user == request.user):
            if(bloodRequest.status == 'Completed'):
                BloodRequestReview.objects.create(blood_request=bloodRequest, rating=rating, description=description) 
                bloodRequest.status = 'Reviewed'
                bloodRequest.save()
                return Response({'success': True, 'message': 'Your review was submitted successfully 😀'}, status=status.HTTP_200_OK)
            else:
                return Response({'success': False, 'error': 'Please wait until the blood requestor submits his review.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'success': False, 'error': 'You are not authorized to review this blood requestor for this blood request 😒'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=True, methods=['get'], url_path='get-current-status-of-blood-request-for-me')
    def getCurrentStatusOfBloodRequestForMe(self, request, pk=None):
        try:
            bloodRequest = BloodRequest.objects.get(id=pk)
        except BloodRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Blood request does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            print(e)
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)
        if(bloodRequest.user == request.user):
            
            if(bloodRequest.status == 'Open'):
                bloodRequestGot =  len(DonorRequest.objects.filter(blood_request=bloodRequest, status="Pending"))
                return Response({'success': True, 'message': f'You have got total {bloodRequestGot} donor request. Please check them and respond to them 🙂', 'type': 'info'}, status=status.HTTP_200_OK)
            elif(bloodRequest.status == 'Accepted'):
                bloodRequestGot =  len(DonorRequest.objects.filter(blood_request=bloodRequest, status="Pending"))
                return Response({'success': True, 'message': f'You have accepted a donor request. That user will come to donate blood.', 'type': 'success'}, status=status.HTTP_200_OK)
            
            elif(bloodRequest.status == 'Completed'): 
                reviewedDonorRequest = DonorRequestReview.objects.get(donor_request__blood_request=bloodRequest)
                return Response({'success': True, 'message': f'You have completed the blood request and you gave {reviewedDonorRequest.rating} star review to the donor 🙂', 'type': 'success'}, status=status.HTTP_200_OK)
            
            elif(bloodRequest.status == 'Reviewed'):
                
                donorRequestReview = DonorRequestReview.objects.get(donor_request=DonorRequest.objects.get(blood_request=bloodRequest, status='Reviewed'))
                bloodRequestReview = BloodRequestReview.objects.get(blood_request=bloodRequest)
                return Response({'success': True, 'message': f'Everything was completed successfully with this blood request the donor requestor gave you {bloodRequestReview.rating} star rating and you gave him {donorRequestReview.rating} 🙂', 'type': 'success'}, status=status.HTTP_200_OK)
            

        else:
            try:
                donorRequest = DonorRequest.objects.get(blood_request=bloodRequest, user=request.user)
                print(donorRequest.date_time)
                if(donorRequest.status == 'Pending' and donorRequest.blood_request.status == 'Open'):
                    return Response({'success': True, 'message': f'You have sent a donor request. Please wait for the blood requestor to check your donor request and respond to it 🙂', 'type': 'info'}, status=status.HTTP_200_OK)
                
                if(donorRequest.status == 'Accepted' and donorRequest.blood_request.status == 'Accepted'):
                    return Response({'success': True, 'message': f'Your donor request was accepted by the blood requestor. You have to donate blood at {donorRequest.date_time.strftime("%I:%M %p on %d %B %Y")} 🙂', 'type': 'info'}, status=status.HTTP_200_OK)
                
                if(donorRequest.status == 'Reviewed' and donorRequest.blood_request.status == 'Completed'):
                    donorRequestReview = DonorRequestReview.objects.get(donor_request=donorRequest)
                    return Response({'success': True, 'message': f'The blood requestor has completed the request and gave you a review. Please review the blood requestor to see your review 🙂', 'type': 'success'}, status=status.HTTP_200_OK)
 
                if(donorRequest.status == 'Reviewed' and donorRequest.blood_request.status == 'Reviewed'):
                    donorRequestReview = DonorRequestReview.objects.get(donor_request=donorRequest)
                    bloodRequestReview = BloodRequestReview.objects.get(blood_request=donorRequest.blood_request)
                    return Response({'success': True, 'message': f'Everything was completed successfully with this blood request the blood requestor gave you {donorRequestReview.rating} star rating and you gave him {bloodRequestReview.rating} 🙂', 'type': 'success'}, status=status.HTTP_200_OK)
                
                if(donorRequest.status == 'Pending' and donorRequest.blood_request.status != 'Open'):
                    return Response({'success': True, 'message': f'The blood requestor has accpepted someone else\'s donor request. Better luck nex time 😐', 'type': 'danger'}, status=status.HTTP_200_OK)
                
            except DonorRequest.DoesNotExist:
                return Response({'success': True, 'message': 'You haven\'t sent any donor request to this blood request 😶', 'type': 'info'}, status=status.HTTP_200_OK)

            
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
        print('in')
        try:
            donorRequest = DonorRequest.objects.get(id=request.data['donor_request_id'])
            if(donorRequest.blood_request.user != request.user):
                return Response({'success': False, 'error': 'You are not authorized to accept this donor request 😑'}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                if(donorRequest.status == 'Accepted'):
                    return Response({'success': False, 'error': 'You have already accepted this donor request 😒'}, status=status.HTTP_400_BAD_REQUEST)

                if(donorRequest.blood_request.status != 'Open'):
                    return Response({'success': False, 'error': 'You can\'t accept any donor request 😒'}, status=status.HTTP_400_BAD_REQUEST)
                    
                for dr in DonorRequest.objects.filter(blood_request=donorRequest.blood_request):
                    if(dr.status == 'Accepted'):
                        return Response({'success': False, 'error': 'You can\'t accept more than one donor request 😒'}, status=status.HTTP_400_BAD_REQUEST)
                
                if(donorRequest.status == "Pending"):
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
    def rejectDonorRequest(self, request):
        try:
            donorRequest = DonorRequest.objects.get(id=request.data['donor_request_id'])
            if(donorRequest.blood_request.user != request.user):
                return Response({'success': False, 'error': 'You are not authorized to reject this donor request 😑'}, status=status.HTTP_401_UNAUTHORIZED)            
        
            if(donorRequest.blood_request.status not in ['Open', 'Accepted']):
                return Response({'success': False, 'error': 'You can\'t reject any donor request now 😒'}, status=status.HTTP_400_BAD_REQUEST)
                
                
            
            if(donorRequest.status == 'Rejected'):
                return Response({'success': False, 'error': 'You have already rejected this donor request 😒'}, status=status.HTTP_400_BAD_REQUEST)
                

            if(donorRequest.status == 'Accepted'):
                return Response({'success': False, 'error': 'You can\'t reject an accepted donor request 😒'}, status=status.HTTP_400_BAD_REQUEST)
                
            donorRequest.status = 'Rejected'
            donorRequest.save() 
            return Response(DonorRequestSerializer(donorRequest).data, status=status.HTTP_200_OK)
        except DonorRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Donor request does not exist 😒'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception:
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)
        

    
    @action(detail=False, methods=['post'], url_path='cancel-accepted-donor-request')
    def cancelAcceptedDonorRequest(self, request):
        try:
            donorRequest = DonorRequest.objects.get(id=request.data['donor_request_id'])
            if(donorRequest.blood_request.user != request.user):
                return Response({'success': False, 'error': 'You are not authorized to reject this donor request 😑'}, status=status.HTTP_401_UNAUTHORIZED)
            
            
            if(donorRequest.blood_request.status != 'Accepted'):
                return Response({'success': False, 'error': 'You can\'t accept any donor request 😒'}, status=status.HTTP_400_BAD_REQUEST)
                
            
            
            if(donorRequest.status == 'Accepted'):
                donorRequest.status = 'Pending'
                donorRequest.save() 
                donorRequest.blood_request.status = 'Open'
                donorRequest.blood_request.save()
            else:
                return Response({'success': False, 'error': 'You can only cancel accepted donor requests.'}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(DonorRequestSerializer(donorRequest).data, status=status.HTTP_200_OK)
        except DonorRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Donor request does not exist 😒'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception:
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)
        


        
    @action(detail=False, methods=['get'], url_path='get-my-donor-request-status-for-blood-request')
    def getMyDonorRequestStatusForBloodRequest(self, request):
        try:
            donor_request = DonorRequest.objects.get(blood_request__id=request.query_params['blood_request_id'])
        except DonorRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Donor request does not exist 😒'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)
        if(donor_request.user != request.user):
            return Response({'success': False, 'error': 'You are not authorized to view this donor request 😑'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'status': DonorRequestSerializer(donor_request).data['status']}, status=status.HTTP_200_OK)

        
    @action(detail=True, methods=['get'], url_path='get-donor-request-status')
    def getDonorRequestStatus(self, request, pk=None):
        donor_request = self.get_object() 
        if(donor_request.user != request.user):
            return Response({'success': False, 'error': 'You are not authorized to view this donor request 😑'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(DonorRequestSerializer(donor_request).data['status'], status=status.HTTP_200_OK)