from django.http import JsonResponse
import requests
from decouple import config

# Load credentials from .env file
CLIENT_ID = config("REACT_APP_GOOGLE_CLIENT_ID")
CLIENT_SECRET = config("REACT_APP_GOOGLE_CLIENT_SECRET")
REDIRECT_URI = config("REACT_APP_GOOGLE_REDIRECT_URI")

def google_auth_callback(request):
    # Get the authorization code from the query params
    code = request.GET.get("code")
    if not code:
        return JsonResponse({"error": "Authorization code not provided"}, status=400)

    # Exchange the authorization code for an access token
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    response = requests.post(token_url, data=data)
    if response.status_code == 200:
        token_data = response.json()
        # Save the access and refresh tokens securely in your database
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token")

        # Return a success message
        return JsonResponse({"message": "Authorization successful", "access_token": access_token})
    else:
        return JsonResponse({"error": "Failed to exchange token", "details": response.json()}, status=response.status_code)
