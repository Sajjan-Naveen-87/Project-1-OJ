from django.urls import path, include
from accounts import views as UserViews
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('register/',UserViews.RegisterView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('problems/',include('problem_set.urls')),
    path('compiler/',include('compiler.urls')),
    path('accounts/', include('accounts.urls')),
    path('leaderboard/', include('leaderboard.urls')),
    path('ai/', include('ai.urls')),
]
