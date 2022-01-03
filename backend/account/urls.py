from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)


from account.apis import *




# 
router = routers.DefaultRouter()
router.register(r'users', UserViewSets) 

urlpatterns = [
    path('verify/<str:code>/', verify),
    path('resend-verification-code/', resend_verification_code),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + router.urls
