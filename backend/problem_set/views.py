from rest_framework import viewsets
from .models import Problems
from .serializers import ProblemSerializer
from rest_framework.renderers import JSONRenderer
from django.http import JsonResponse

# class ProblemViewSet(viewsets.ModelViewSet):
#     queryset = Problems.objects.all().order_by('-id')
#     serializer_class = ProblemSerializer

def problems(request):
    queryset = Problems.objects.all().order_by('-id')
    # serializer_class = ProblemSerializer
    serializer = ProblemSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)

def problems_by_id(request,id):
    queryset = Problems.objects.get(id=id)
    # serializer_class = ProblemSerializer
    serializer = ProblemSerializer(queryset)
    return JsonResponse(serializer.data)