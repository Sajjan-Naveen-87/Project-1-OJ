from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from google import genai
from decouple import config
@api_view(['POST'])
def process_prompt(request):
    prompt = request.data.get('prompt', '')
    client = genai.Client(api_key=config("GEMINI_API_KEY"))
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        ai_response = response.text
        return Response({'response': ai_response}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)