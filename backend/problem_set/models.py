from django.db import models
from tinymce.models import HTMLField
from django.core.exceptions import ValidationError

class Problems(models.Model):
    PROBLEM_LEVELS = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
        ('Extreme', 'Extreme')
    ]

    POINTS_CHOICES = [(i, i) for i in range(1, 5)]
    RATING_CHOICES = [(i, i) for i in range(0, 6)]

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, unique=True)
    problem_level = models.CharField(max_length=10, choices=PROBLEM_LEVELS)
    problem_desc = HTMLField()

    test_cases = models.FileField(upload_to='testcases/', help_text="Upload JSON file with input/output test cases")

    max_runtime = models.FloatField(help_text="Max allowed runtime in seconds")
    max_memory = models.IntegerField(help_text="Max allowed memory in MB")
    problem_runtime = models.FloatField(null=True, blank=True, help_text="Actual runtime in seconds")
    problem_memory = models.IntegerField(null=True, blank=True, help_text="Actual memory in MB")

    previous_submissions = models.JSONField(default=dict, blank=True)
    rating_to_problem = models.IntegerField(default=0, null=True, choices=RATING_CHOICES)
    points_awarded = models.IntegerField(choices=POINTS_CHOICES)

    total_submissions = models.IntegerField(default=0)
    successful_submissions = models.IntegerField(default=0)
    accuracy = models.FloatField(default=0.0, help_text="Percentage of users who successfully solved the problem")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.problem_runtime and self.problem_runtime > self.max_runtime:
            raise ValidationError("Problem runtime exceeds the max allowed runtime.")
        if self.problem_memory and self.problem_memory > self.max_memory:
            raise ValidationError("Problem memory exceeds the max allowed memory.")

    def update_accuracy(self):
        if self.total_submissions > 0:
            self.accuracy = (self.successful_submissions / self.total_submissions) * 100
        else:
            self.accuracy = 0.0
        self.save(update_fields=['accuracy'])

    def __str__(self):
        return f"{self.title} ({self.problem_level})"

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Problem'
        verbose_name_plural = 'Problems'