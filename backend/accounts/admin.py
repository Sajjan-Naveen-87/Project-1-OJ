from django.contrib import admin
from .models import Person

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('user', 'first_name', 'last_name', 'score', 'rank')
    search_fields = ('user__username', 'first_name', 'last_name')