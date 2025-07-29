from django.urls import path
from .views import compile_code , submit_code

urlpatterns = [
    path("", compile_code, name="compile-code"),
    path("submit/", submit_code, name="compile-code"),

]