from django.urls import path
from .views import process_prompt

urlpatterns = [
    path("analyze/", process_prompt, name='code_analyze'),
]