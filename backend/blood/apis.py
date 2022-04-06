from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework.filters import OrderingFilter, SearchFilter
from django.core.exceptions import ObjectDoesNotExist

from django.db.models import Q
import time

# from rest_framework.permissions import

from account.models import Profile as UserProfile
from account.serializers import ProfileSerializer
from .serializers import *
from .models import *


# Create your views here.

User = get_user_model()


class BloodRequestViewSet(ModelViewSet):
    queryset = BloodRequest.objects.all()
    serializer_class = BloodRequestSerializer
    filter_backends = [DjangoFilterBackend,  SearchFilter]
    filterset_fields = ['status']
    # ordering_fields = ['date_time', 'timestamp', 'location']
    search_fields = ["name", "email", "date_time", "number", "add_number", "blood_group", "location", "status", "description", "timestamp" ]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if(request.user.is_staff or request.user.is_superuser):
            return super().destroy(request, *args, **kwargs)
        
        if(instance.user == request.user):
            if(instance.status == "Open"):
                return super().destroy(request, *args, **kwargs)
            else:
                return Response( {'success': False,  "error": "You can't delete this request now "}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({ 'success': False, "error": "You are not authorized to delete this request"}, status=status.HTTP_403_FORBIDDEN)
        
        

    @action(detail=True, methods=['get'], url_path='have-sent-donor-request')
    def haveSentDonorRequest(self, request, pk=None):
        blood_request = self.get_object()
        if DonorRequest.objects.filter(blood_request=blood_request.id, user=request.user).exists():
            return Response({'success': True, 'message': 'You have already sent a donor request', "haveSentDonorRequest": True}, status=status.HTTP_200_OK)
        else:
            return Response({'success': True, 'message': 'You haven\'t sent any donor request', "haveSentDonorRequest": False}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='get-total-donor-requests-for-blood-request')
    def getTotalDonorRequestsForBloodRequest(self, request, pk=None):
        try:
            bloodRequest = BloodRequest.objects.get(id=pk)
        except BloodRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Blood request does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)

        donorRequests = DonorRequest.objects.filter(
            blood_request=bloodRequest).order_by('-timestamp')
        donorRequests = donorRequests.filter(~Q(status="Rejected"))
        return Response({"total": len(donorRequests)}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='review-donor-for-blood-request')
    def reviewDonorForBloodRequest(self, request, pk=None):
        try:
            bloodRequest = BloodRequest.objects.get(id=pk)
        except BloodRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Blood request does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
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
                donorRequests = DonorRequest.objects.filter(
                    blood_request=bloodRequest)
                for dReq in donorRequests:
                    if(dReq.status == 'Accepted'):
                        dReq.status = 'Reviewed'
                        dReq.save()
                        try:
                            DonorRequestReview.objects.create(
                                donor_request=dReq, rating=rating, description=description)
                        except Exception as e:
                            pass
                bloodRequest.status = 'Reviewed By Requestor'
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
        except Exception as e:
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            rating = request.data['rating']
            description = request.data['description']
        except Exception as e:
            print(type(e))
            e = str(e).replace("\'", "").capitalize()
            return Response({'success': False, 'error':  f'{e} is required 😒'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            donorRequest = DonorRequest.objects.get(
                blood_request=bloodRequest, user=request.user)
        except BloodRequest.DoesNotExist:
            return Response({'success': False, 'error': 'You haven\'t sent any donor request to this blood request'}, status=status.HTTP_401_UNAUTHORIZED)
        if(donorRequest.user == request.user):
            if(bloodRequest.status == 'Reviewed By Requestor'):
                BloodRequestReview.objects.create(
                    blood_request=bloodRequest, rating=rating, description=description)
                bloodRequest.status = 'Completed'
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
        except Exception as e:
            print(e)
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)
        if (bloodRequest.user == request.user):

            if (bloodRequest.status == 'Open'):
                bloodRequestGot = len(DonorRequest.objects.filter(
                    blood_request=bloodRequest, status="Pending"))
                return Response({'success': True, 'message': f'You have got total {bloodRequestGot} donor request. Please check them and respond to them 🙂', 'type': 'info'}, status=status.HTTP_200_OK)
            elif bloodRequest.status == 'Accepted':
                bloodRequestGot = len(DonorRequest.objects.filter(
                    blood_request=bloodRequest, status="Pending"))
                return Response({'success': True, 'message': 'You have accepted a donor request. That user will come to donate blood.', 'type': 'success'}, status=status.HTTP_200_OK)


            elif(bloodRequest.status == 'Reviewed By Requestor'):
                reviewedDonorRequest = DonorRequestReview.objects.get(
                    donor_request__blood_request=bloodRequest)
                return Response({'success': True, 'message': f'You gave {reviewedDonorRequest.rating} star review to the donor 🙂', 'type': 'success'}, status=status.HTTP_200_OK)

            elif(bloodRequest.status == 'Completed'):

                donorRequestReview = DonorRequestReview.objects.get(
                    donor_request=DonorRequest.objects.get(blood_request=bloodRequest, status='Reviewed'))
                bloodRequestReview = BloodRequestReview.objects.get(
                    blood_request=bloodRequest)
                return Response({'success': True, 'message': f'Everything was completed successfully with this blood request the donor requestor gave you {bloodRequestReview.rating} star rating and you gave him {donorRequestReview.rating} 🙂', 'type': 'success'}, status=status.HTTP_200_OK)

        else:
            try:
                donorRequest = DonorRequest.objects.get(
                    blood_request=bloodRequest, user=request.user)
                print(donorRequest.date_time)
                if (donorRequest.status == 'Pending' and donorRequest.blood_request.status == 'Open'):
                    return Response({'success': True, 'message': 'You have sent a donor request. Please wait for the blood requestor to check your donor request and respond to it 🙂', 'type': 'info'}, status=status.HTTP_200_OK)


                if(donorRequest.status == 'Accepted' and donorRequest.blood_request.status == 'Accepted'):
                    return Response({'success': True, 'message': f'Your donor request was accepted by the blood requestor. You have to donate blood at {donorRequest.date_time.strftime("%I:%M %p on %d %B %Y")} 🙂', 'type': 'info'}, status=status.HTTP_200_OK)

                if (donorRequest.status == 'Reviewed' and donorRequest.blood_request.status == 'Reviewed By Requestor'):
                    donorRequestReview = DonorRequestReview.objects.get(
                        donor_request=donorRequest)
                    return Response({'success': True, 'message': 'The blood requestor has completed the request and gave you a review. Please review the blood requestor to see your review 🙂', 'type': 'success'}, status=status.HTTP_200_OK)


                if(donorRequest.status == 'Reviewed' and donorRequest.blood_request.status == 'Completed'):
                    donorRequestReview = DonorRequestReview.objects.get(
                        donor_request=donorRequest)
                    bloodRequestReview = BloodRequestReview.objects.get(
                        blood_request=donorRequest.blood_request)
                    return Response({'success': True, 'message': f'Everything was completed successfully with this blood request the blood requestor gave you {donorRequestReview.rating} star rating and you gave him {bloodRequestReview.rating} 🙂', 'type': 'success'}, status=status.HTTP_200_OK)

                if (donorRequest.status == 'Pending' and donorRequest.blood_request.status != 'Open'):
                    return Response({'success': True, 'message': "The blood requestor has accpepted someone else\'s donor request 😐. You still have a chance.", 'type': 'danger'}, status=status.HTTP_200_OK)


            except DonorRequest.DoesNotExist:
                if(bloodRequest.status == 'Open'):
                    return Response({'success': True, 'message': 'You haven\'t sent any donor request to this blood request 😶', 'type': 'info'}, status=status.HTTP_200_OK)

                elif(bloodRequest.status  == 'Accepted'):
                    return Response({'success': True, 'message': 'The requestor has accepted someone\'s donor request. You can still send a donor request, if the blood requestor likes\'s your request then he can accept your request.'}, status=status.HTTP_200_OK)

                else:
                    return Response({'success': True, 'message': 'You can not send any donor request right now 😶', 'type': 'danger'}, status=status.HTTP_200_OK)
                        
                     

    @action(detail=True, methods=['get'], url_path='get-donors-review-for-blood-request')
    def getDonorsReviewForBloodRequest(self, request, pk=None):
        bloodRequest = self.get_object()

        try:

            donorRequest = DonorRequest.objects.get(
                blood_request=bloodRequest, status='Reviewed')
        except DonorRequest.DoesNotExist:
            return Response({'success': False, 'error': 'No reviewed donor request was found for this blood request'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            donorsReviewData = DonorRequestReviewSerializer(
                DonorRequestReview.objects.get(donor_request=donorRequest)).data
        except DonorRequestReview.DoesNotExist:
            return Response({'success': False, 'error': 'Donor\'s review for this blood request was not found'}, status=status.HTTP_400_BAD_REQUEST)

        if(not BloodRequestReview.objects.filter(blood_request=bloodRequest).exists() and bloodRequest.user != request.user):
            return Response({'success': True, 'message': 'You have not reviewed the blood requestor yet. Please review the blood requestor to see your review 🙂', 'code': 'blood_request_not_reviewed'}, status=status.HTTP_200_OK)

        respose = {
            'success': True,
            'review': donorsReviewData,
        }
        return Response(respose, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='get-requestors-review-for-blood-request')
    def getRequestorsReviewForBloodRequest(self, request, pk=None):
        bloodRequest = self.get_object()
        try:
            requestorsReviewData = BloodRequestReviewSerializer(
                BloodRequestReview.objects.get(blood_request=bloodRequest)).data
        except BloodRequestReview.DoesNotExist:
            if(bloodRequest.status != 'Completed'):
                return Response({'success': True, 'message': 'The donor has not submitted his review. Please until the donor submits his review',  'code': 'review_not_submitted'}, status=status.HTTP_200_OK)
            return Response({'success': False, 'error': 'Requestors\'s review for this blood request was not found', 'code': 'requestor_review_not_found'}, status=status.HTTP_400_BAD_REQUEST)

        respose = {
            'success': True,
            'review': requestorsReviewData,
        }
        return Response(respose, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='report')
    def report(self, request, pk=None):
        bloodRequest = self.get_object()
        if(bloodRequest.user == request.user):
            return Response({'success': False, 'error': 'You cannot report your own blood request'}, status=status.HTTP_400_BAD_REQUEST)

        if(BloodRequestReport.objects.filter(blood_request=bloodRequest, reported_by=request.user).exists()):
            return Response({'success': False, 'error': 'You have already reported this blood request'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            BloodRequestReport.objects.create(
                blood_request=bloodRequest, reported_by=request.user, description=request.data['description'])
        except Exception:
            return Response({'success': False, 'error': 'Something went wrong. Please try again'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'success': True, 'message': 'You have reported this blood request. We will review it soon'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='get-all-blood-request-by-me')
    def getAllBloodRequestByMe(self, request):
        print("in in in ")
        bloodRequests = BloodRequest.objects.filter(user=request.user)
        return Response(self.get_serializer(bloodRequests, many=True).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='filter-my-blood-requests')
    def filterMyBloodRequests(self, request):
        bloodRequests = BloodRequest.objects.filter(user=request.user)

        filtered_blood_requests = self.filter_queryset(bloodRequests)
        return Response(self.get_serializer(filtered_blood_requests.order_by('-id'), many=True).data, status=status.HTTP_200_OK)
 


    @action(detail=False, methods=['get', 'post', 'delete'], url_path='favorites')
    def favorites(self, request):
        if (request.method == 'GET'):
            favBloodRequests = FavoriteBloodRequest.objects.filter(user=request.user)
            bloodRequests = [fav.blood_request for fav in favBloodRequests]
            return Response(self.get_serializer(bloodRequests, many=True).data, status=status.HTTP_200_OK)

        elif(request.method == 'POST'):
            try:
                bloodRequest = BloodRequest.objects.get(id=request.data['blood_request_id'])
                
            except BloodRequest.DoesNotExist:
                return Response({'success': False, 'error': 'Blood request not found'}, status=status.HTTP_400_BAD_REQUEST)
            
            if(FavoriteBloodRequest.objects.filter(user=request.user, blood_request=bloodRequest).exists()):
                return Response({'success': False, 'error': 'You have already added this blood request to your favorites'}, status=status.HTTP_400_BAD_REQUEST)
                
            FavoriteBloodRequest.objects.create(user=request.user, blood_request=bloodRequest)
            return Response({'success': True, 'message': 'Blood request added to your favorites list 🙂'}, status=status.HTTP_201_CREATED)

        elif(request.method == "DELETE"):
            try:
                bloodRequest = BloodRequest.objects.get(id=request.data['blood_request_id'])
            except BloodRequest.DoesNotExist:
                return Response({'success': False, 'error': 'This blood request not found'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                FavoriteBloodRequest.objects.get(user=request.user, blood_request=bloodRequest).delete()
            except FavoriteBloodRequest.DoesNotExist:
                return Response({'success': False, 'error': 'Blood request not found in your favorites list'}, status=status.HTTP_400_BAD_REQUEST)
            # except Exception:
            #     return Response({'success': False, 'error': 'Something went wrong. Please try again'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'success': True, 'message': 'Blood request removed from your favorites list 🙂'}, status=status.HTTP_204_NO_CONTENT)
 

class DonorRequestViewSet(ModelViewSet):
    queryset = DonorRequest.objects.all().order_by('-timestamp')
    serializer_class = DonorRequestSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    # authentication_classes = [SessionAuthentication]
    filterset_fields = ['status']
    ordering_fields = ['date_time', 'timestamp', 'location']
    search_fields = ['name', 'email', 'number',
                     'add_number', 'address', 'status']

    def list(self, request, *args, **kwargs):
        if(request.user.is_staff):
            return super().list(request, *args, **kwargs)
        else:
            return Response({'success': False, 'error': 'You are not authorized to view this page'}, status=status.HTTP_401_UNAUTHORIZED)

    def create(self, request, *args, **kwargs): 
        try:
            
            if(not UserProfile.objects.get(user=request.user).isCompleted):
                return Response({'success': False, 'message': 'You must complete your profile before sending a donor request'}, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
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
            bloodRequest = BloodRequest.objects.get(
                id=request.GET['bloodRequestId'])
        except BloodRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Blood request does not exist'}, status=status.HTTP_404_NOT_FOUND)

        try:
            donorRequest = DonorRequest.objects.get(
                blood_request=bloodRequest, user=request.user)
            return Response(self.get_serializer(donorRequest).data, status=status.HTTP_200_OK)
        except DonorRequest.DoesNotExist:
            return Response({'success': False, 'error': 'You have not sent any donor request'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='get-donor-requests-for-my-blood-request')
    def getDonorRequestsForMyBloodRequest(self, request):
        try:
            bloodRequest = BloodRequest.objects.get(
                id=request.GET['blood_request_id'])
        except BloodRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Blood request does not exist'}, status=status.HTTP_404_NOT_FOUND)

        donorRequests = DonorRequest.objects.filter(
            blood_request=bloodRequest).order_by('-timestamp')
        donorRequests = donorRequests.filter(~Q(status="Rejected"))
        data = self.get_serializer(donorRequests, many=True).data

        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='accept-donor-request')
    def acceptDonorRequest(self, request):
        print('in')
        try:
            donorRequest = DonorRequest.objects.get(
                id=request.data['donor_request_id'])
            if donorRequest.blood_request.user != request.user:
                return Response({'success': False, 'error': 'You are not authorized to accept this donor request 😑'}, status=status.HTTP_401_UNAUTHORIZED)
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
                return Response(self.get_serializer(donorRequest).data, status=status.HTTP_200_OK)

        except DonorRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Donor request does not exist 😒'}, status=status.HTTP_404_NOT_FOUND)

        except Exception:
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='reject-donor-request')
    def rejectDonorRequest(self, request):
        try:
            donorRequest = DonorRequest.objects.get(
                id=request.data['donor_request_id'])
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
            return Response(self.get_serializer(donorRequest).data, status=status.HTTP_200_OK)
        except DonorRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Donor request does not exist 😒'}, status=status.HTTP_404_NOT_FOUND)

        except Exception:
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='cancel-accepted-donor-request')
    def cancelAcceptedDonorRequest(self, request):
        try:
            donorRequest = DonorRequest.objects.get(
                id=request.data['donor_request_id'])
            if(donorRequest.blood_request.user != request.user):
                return Response({'success': False, 'error': 'You are not authorized to reject this donor request 😑'}, status=status.HTTP_401_UNAUTHORIZED)

            if(donorRequest.blood_request.status != 'Accepted'):
                return Response({'success': False, 'error': 'You can\'t accept any donor request 😒'}, status=status.HTTP_400_BAD_REQUEST)

            if donorRequest.status != 'Accepted':
                return Response({'success': False, 'error': 'You can only cancel accepted donor requests.'}, status=status.HTTP_400_BAD_REQUEST)

            donorRequest.status = 'Pending'
            donorRequest.save()
            donorRequest.blood_request.status = 'Open'
            donorRequest.blood_request.save()
            return Response(self.get_serializer(donorRequest).data, status=status.HTTP_200_OK)
        except DonorRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Donor request does not exist 😒'}, status=status.HTTP_404_NOT_FOUND)

        except Exception:
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='get-my-donor-request-status-for-blood-request')
    def getMyDonorRequestStatusForBloodRequest(self, request):
        try:
            donor_request = DonorRequest.objects.get(
                blood_request__id=request.query_params['blood_request_id'], user=request.user)
        except DonorRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Donor request does not exist 😒'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response({'success': False, 'error': 'Something went wrong 😕'}, status=status.HTTP_400_BAD_REQUEST)
        if(donor_request.user != request.user):
            return Response({'success': False, 'error': 'You are not authorized to view this donor request 😑'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'status': self.get_serializer(donor_request).data['status']}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='filter-donor-request-for-blood-request')
    def filterDonorRequestForBloodRequest(self, request):
        try:
            bloodRequest = BloodRequest.objects.get(
                id=request.query_params['blood_request_id'])
        except BloodRequest.DoesNotExist:
            return Response({'success': False, 'error': 'Blood request does not exist 😒'}, status=status.HTTP_404_NOT_FOUND)

        if(bloodRequest.user != request.user):
            return Response({'success': False, 'error': 'You are not authorized to view this blood request 😑'}, status=status.HTTP_401_UNAUTHORIZED)

        donor_requests = DonorRequest.objects.filter(
            blood_request=bloodRequest)
        filtered_donor_requests = self.filter_queryset(donor_requests)
        return Response(self.get_serializer(filtered_donor_requests.order_by('-id'), many=True).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='get-all-donor-request-by-me')
    def getAllDonorRequestByMe(self, request):
        donor_requests = DonorRequest.objects.filter(user=request.user)
        filtered_donor_requests = self.filter_queryset(donor_requests)
        return Response(self.get_serializer(filtered_donor_requests.order_by('-id'), many=True).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='report')
    def report(self, request, pk=None):
        donorRequest = self.get_object()
        if(donorRequest.user == request.user):
            return Response({'success': False, 'error': 'You cannot report your own donor request'}, status=status.HTTP_400_BAD_REQUEST)

        if(DonorRequestReport.objects.filter(donor_request=donorRequest, reported_by=request.user).exists()):
            return Response({'success': False, 'error': 'You have already reported this donor request'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            DonorRequestReport.objects.create(
                donor_request=donorRequest, reported_by=request.user, description=request.data['description'])
        except Exception:
            return Response({'success': False, 'error': 'Something went wrong. Please try again'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'success': True, 'message': 'You have reported this donor request. We will review it soon'}, status=status.HTTP_200_OK)





    @action(detail=False, methods=['get', 'post', 'delete'], url_path='favorites')
    def favorites(self, request):
        if (request.method == 'GET'):
            favDonorRequests = FavoriteDonorRequest.objects.filter(user=request.user)
            donorRequest = [fav.donor_request for fav in favDonorRequests]
            return Response(self.get_serializer(donorRequest, many=True).data, status=status.HTTP_200_OK)

        elif(request.method == 'POST'):
            try:
                donorRequest = DonorRequest.objects.get(id=request.data['donor_request_id'])
                
            except DonorRequest.DoesNotExist:
                return Response({'success': False, 'error': 'Donor request not found'}, status=status.HTTP_400_BAD_REQUEST)
            
            if(FavoriteDonorRequest.objects.filter(user=request.user, donor_request=donorRequest).exists()):
                return Response({'success': False, 'error': 'You have already added this donor request to your favorites'}, status=status.HTTP_400_BAD_REQUEST)
                
            FavoriteDonorRequest.objects.create(user=request.user, donor_request=donorRequest)
            return Response({'success': True, 'message': 'Donor request added to your favorites list 🙂'}, status=status.HTTP_201_CREATED)

        elif(request.method == "DELETE"):
            try:
                donorRequest = DonorRequest.objects.get(id=request.data['donor_request_id'])
            except DonorRequest.DoesNotExist:
                return Response({'success': False, 'error': 'This donor request not found'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                FavoriteDonorRequest.objects.get(user=request.user, donor_request=donorRequest).delete()
            except FavoriteDonorRequest.DoesNotExist:
                return Response({'success': False, 'error': 'Donor request not found in your favorites list'}, status=status.HTTP_400_BAD_REQUEST)
            # except Exception:
            #     return Response({'success': False, 'error': 'Something went wrong. Please try again'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'success': True, 'message': 'Donor request removed from your favorites list 🙂'}, status=status.HTTP_204_NO_CONTENT)
 