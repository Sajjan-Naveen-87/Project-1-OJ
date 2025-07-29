from django.db import models
from problem_set.models import Problems

# Create your models here.
class Compiler(models.Model):
    id = models.AutoField(primary_key=True)
    problem = models.ForeignKey(Problems, on_delete=models.CASCADE, related_name="submissions")
    code = models.TextField()
    input_tests = models.TextField(null=True)
    output = models.TextField(null=True)
    verdicts = models.CharField(max_length=100, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    runtime = models.FloatField(null=True)  # in seconds
    memory_used = models.FloatField(null=True)  # in MB