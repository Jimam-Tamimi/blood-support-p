import json
from time import sleep
from account.models import Profile
from account.serializers import UserSerializer
from message.serializers import *
from account.serializers import ProfileSerializer
from message.models import *
from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
# Create your views here.


class MessageViewSet(ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    # filter_backends = [DjangoFilterBackend,  SearchFilter]
    # filterset_fields = ['status']
    # ordering_fields = ['date_time', 'timestamp', 'location']
    # search_fields = ["name", "email", "date_time", "number", "add_number", "blood_group", "location", "status", "description", "timestamp"]

    @action(detail=False, methods=['get'], url_path='get-my-contacts')
    def getMyContacts(self, request):
        # sourcery skip: remove-pass-body, use-contextlib-suppress
        contacts = Contact.objects.filter(users=request.user)
        print(contacts)
        contacts_data = []
        for contact in contacts:
            if(len(contact.users.all()) > 2):
                # for groups
                pass
            else:
                for user in contact.users.all():
                    print(user)
                    if(user != request.user):
                        try:
                            profile = Profile.objects.get(user=user)
                            profile = ProfileSerializer(profile, context={'request': request}).data
                            message = Message.objects.filter(contact=contact).last()
                            contact_profile_data = {
                                "contact_id": contact.id,
                                "profile_img": profile["profile_img"],
                                "name": profile['name'],
                                "user_id": user.id,
                            }
                            if(message):
                                contact_profile_data["last_message_from"] =  "You" if message.from_user == request.user else profile['name'].split()[0],
                                contact_profile_data["last_message"] = message.message

                            contacts_data.append(contact_profile_data)
                        except Profile.DoesNotExist:
                            pass
        # sleep(4)

        return Response({'contacts': contacts_data})


    @action(detail=False, methods=['get'], url_path='get-messages-for-contact')
    def getMessagesForContact(self, request):
        # sourcery skip: remove-pass-body, use-contextlib-suppress
        try:
            contact = Contact.objects.get(id=request.GET['contact_id'])
        except Contact.DoesNotExist:
            return Response({'success': False, 'error': 'Contact does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response({'success': False, 'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
            
        messages = Message.objects.filter(~Q(status='seen'), contact=contact).exclude(from_user=request.user)
        print(messages)
        for msg in messages:
            msg.status= 'seen'
            msg.save()

        messages = Message.objects.filter(contact=contact)
        serialized_messages = self.get_serializer(messages, many=True)
        return Response(serialized_messages.data, status=status.HTTP_200_OK)




    @action(detail=False, methods=['post'], url_path='create-contact')
    def createContact(self, request):
        # sourcery skip: remove-pass-body, use-contextlib-suppress
        try:
            user2 = User.objects.get(id=request.data['user_id'])
        except User.DoesNotExist:
            return Response({'success': False, 'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        user1 = request.user
        
        try:
            contact = Contact.objects.filter(users=user1).get(users=user2)
        except Contact.DoesNotExist:
            contact = Contact.objects.create()
            contact.users.add(user1, user2)
            contact.save()
        # except Exception :
        #     return Response({'success': False, 'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
        
        data ={
            'contact_id': contact.id,
        }
        
        return Response(data, status=status.HTTP_200_OK)





    @action(detail=False, methods=['get'], url_path='get-contact-details')
    def getContactDetails(self, request):
        try:
            contact = Contact.objects.get(id=request.GET['contact_id'])
        except Contact.DoesNotExist:
            return Response({'success': False, 'error': 'Contact does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        data ={
            'contact_id': contact.id,
        }
        if(len(contact.users.all()) > 2):
            # for groups
            pass
        else:
            for user in contact.users.all():
                if(user != request.user): 
                    try:
                        profile = Profile.objects.get(user=user)
                    except Profile.DoesNotExist:
                        return Response({'success': False, 'error': 'This user has not completed his profile'}, status=status.HTTP_404_NOT_FOUND)
                    data['profile'] = ProfileSerializer(profile, context={'request': request}).data        
        return Response(data, status=status.HTTP_200_OK)



