from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
import os
from leaderboard.models import LeaderboardEntry  # adjust path as needed

alpha_validator = RegexValidator(r'^[a-zA-Z]+$', 'Only alphabetic characters are allowed.')

def validate_image_extension(image):
    ext = os.path.splitext(image.name)[1].lower()
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif']
    if ext not in valid_extensions:
        raise ValidationError(f'Unsupported file extension: {ext}. Allowed: jpg, jpeg, png, gif.')

class Person(models.Model):
    GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other'), ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='person_profile')
    
    first_name = models.CharField(max_length=50, validators=[alpha_validator], blank=True, default="")
    last_name = models.CharField(max_length=50, validators=[alpha_validator], blank=True, default="")
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    date_of_joining = models.DateTimeField(auto_now_add=True)

    image = models.ImageField(
        upload_to="profile_images/",
        blank=True,
        null=True,
        validators=[validate_image_extension]
    )

    score = models.FloatField(default=0.0)
    rank = models.IntegerField(unique=True, blank=True, null=True)
    problems_attempted = models.IntegerField(default=0)
    problems_solved = models.IntegerField(default=0)

    about = models.TextField(blank=True)
    profession = models.CharField(max_length=100, blank=True, default="")
    public_account = models.BooleanField(default=False)
    groups_joined = models.CharField(max_length=255, blank=True)

    def clean(self):
        if self.image:
            if self.image.size > 1024 * 1024:
                raise ValidationError("Image size should not exceed 1MB.")
            validate_image_extension(self.image)

    def save(self, *args, skip_update_ranks=False, **kwargs):
        self.full_clean()
        if self.pk is None and self.rank is None:
            last_rank = Person.objects.aggregate(models.Max('rank'))['rank__max'] or 0
            self.rank = last_rank + 1
        super().save(*args, **kwargs)
        if not skip_update_ranks:
            self.update_ranks()

        # Sync with LeaderboardEntry
        LeaderboardEntry.objects.update_or_create(
            user=self.user,
            defaults={'score': self.score}
        )

    @classmethod
    def update_ranks(cls):
        people = cls.objects.order_by('-score', 'date_of_joining')
        for index, person in enumerate(people, start=1):
            if person.rank != index:
                person.rank = index
                person.save(update_fields=['rank'], skip_update_ranks=True)
                LeaderboardEntry.objects.update_or_create(
                    user=person.user,
                    defaults={'score': person.score}
                )

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.user.username})"

# Add Meta class to LeaderboardEntry for ordering
LeaderboardEntry._meta.ordering = ['-score', 'user__person_profile__date_of_joining']