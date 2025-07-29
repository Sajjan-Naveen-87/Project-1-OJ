from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import LeaderboardEntry
from .serializers import LeaderboardEntrySerializer

@api_view(['GET'])
def leaderboard(request):
    entries = LeaderboardEntry.objects.order_by('-score', 'last_updated')
    serializer = LeaderboardEntrySerializer(entries, many=True)

    # Assign rank dynamically
    ranked_data = []
    for index, entry in enumerate(serializer.data, start=1):
        ranked_data.append({
            **entry,
            'rank': index
        })

    return Response(ranked_data)