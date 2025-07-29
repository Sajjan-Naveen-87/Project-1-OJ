from django.db import models
from django.contrib.auth.models import User


class LeaderboardEntry(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    score = models.FloatField(default=0.0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.score}"