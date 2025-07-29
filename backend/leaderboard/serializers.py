from rest_framework import serializers
from .models import LeaderboardEntry

class LeaderboardEntrySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = LeaderboardEntry
        fields = ['username', 'score', 'last_updated']