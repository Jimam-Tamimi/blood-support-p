from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register((BloodRequest, DonorRequest, DonorRequestReview, BloodRequestReview, FavoriteBloodRequest, FavoriteDonorRequest, BloodRequestReport, DonorRequestReport, Notification, NotificationData))