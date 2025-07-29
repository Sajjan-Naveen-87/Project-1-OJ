from django.urls import path
from .views import get_profile_by_username, update_profile, RegisterView

urlpatterns = [
    path('profile/<str:username>/', get_profile_by_username, name='profile-by-username'),
    path('profile/<str:username>/update/', update_profile, name='updateprofile'),
    path('register/', RegisterView.as_view(), name='registerprofile'),
]