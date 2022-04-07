
import django_filters
from rest_framework.filters import SearchFilter

from account.models import  Profile

class ProfileFilter(django_filters.FilterSet,  SearchFilter):
    class Meta:
        model = Profile
        fields = [ 'user' ,'name' ,'email' ,'blood_group' ,'address' ,'number' ,'add_number'  ,'isCompleted' ,'description']
        # search_fields = [ 'user' ,'name' ,'email' ,'blood_group' ,'address' ,'number' ,'add_number'  ,'isCompleted' ,'description']