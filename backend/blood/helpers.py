
import random
import string
from django.utils.text import slugify

from account.models import Profile 
from blood.models import BloodRequest, DonorRequest

from django.db.models import Q

def random_string_generator(len):
    return ''.join(random.choices(string.ascii_letters+string.digits,k=len))


def generate_slug(slugStr, sender, randStrlen=5 ):
    def get_slug():
        return slugify(f"{slugStr} {random_string_generator(randStrlen)}")
    while True:
        slug = get_slug()
        if not sender.objects.filter(slug=slug).exists():
            return slug
            break 


def get_users_within_my_area(user, distance=5):
    profiles = Profile.objects.all().exclude(user=user)
    for profile in profiles:
        print(profile.distance_from_user(user), distance)
        if profile.distance_from_user(user) <= distance:
            yield profile.user

def get_users_within_an_area(location, distance=5):
    profiles = Profile.objects.all()
    for profile in profiles:
        if profile.distance_from(location) <= distance:
            yield profile.user
            
def get_users_from_blood_request_for_donor_request(user):
    donorRequests = DonorRequest.objects.filter(user=user)
    for donorReq in donorRequests:
        yield donorReq.blood_request.user
            
def get_users_from_accepted_or_reviewed_donor_request(user):
    donorRequests = DonorRequest.objects.filter(blood_request__user=user ).filter(Q(status="Accepted") | Q(status="Reviewed"))
    for donorReq in donorRequests:
        yield donorReq.user