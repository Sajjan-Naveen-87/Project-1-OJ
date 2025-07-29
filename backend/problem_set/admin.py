from django.contrib import admin
from .models import Problems

# models here
@admin.register(Problems)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'problem_level', 'points_awarded', 'accuracy', 'rating_to_problem')
    search_fields = ('problem_id', 'problem_level')
    list_filter = ('problem_level',)