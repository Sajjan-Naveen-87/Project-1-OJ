from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from .views import ProblemViewSet
from. import views
# router = DefaultRouter()
# router.register(r'problems', ProblemViewSet)

urlpatterns = [
    path('', views.problems,name="problems"),
    path('<int:id>', views.problems_by_id,name="problems"),
]