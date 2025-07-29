from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import Person
from leaderboard.models import LeaderboardEntry  # adjust if your app name is different

class Command(BaseCommand):
    help = "Sync LeaderboardEntry with data from Person model"

    def handle(self, *args, **kwargs):
        count = 0
        persons = Person.objects.select_related('user')
        for person in persons:
            entry, created = LeaderboardEntry.objects.update_or_create(
                user=person.user,
                defaults={'score': person.score}
            )
            count += 1
        self.stdout.write(self.style.SUCCESS(f'Successfully synced {count} leaderboard entries.'))