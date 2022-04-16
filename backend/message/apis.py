import json
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
                                "last_message_from":  "You" if message.from_user == request.user else profile['name'].split()[0],
                                "last_message": message.message,
                            }

                            contacts_data.append(contact_profile_data)
                        except Profile.DoesNotExist:
                            pass
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
            
        messages = Message.objects.filter(contact=contact)
        serialized_messages = self.get_serializer(messages, many=True)
        return Response(serialized_messages.data, status=status.HTTP_200_OK)



