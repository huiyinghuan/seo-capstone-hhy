from django.http import JsonResponse
import requests
from decouple import config
from datetime import datetime, timedelta
from .models import GSCAccountToken

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
        return JsonResponse({"error": "Failed to fetch tokens", "details": response.json()}, status=response.status_code)
    tokens = response.json()
    access_token = tokens.get('access_token')
    refresh_token = tokens.get('refresh_token')
    expires_in = tokens.get('expires_in')  # Token expiry time in seconds

    # Calculate the expiry timestamp
    token_expiry = datetime.now() + timedelta(seconds=expires_in)

    # Save tokens to the database
    # Replace `user_id` with the ID or identifier for the currently logged-in user
    user_id = request.session.get('user_id', 'default_user')  # Replace with actual user logic if needed
    GSCAccountToken.objects.update_or_create(
        user=user_id,
        defaults={
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_expiry': token_expiry
        }
    )

    return JsonResponse({"message": "Google Account Connected!"})

def refresh_access_token(user_id):
    try:
        user_token = UserToken.objects.get(user_id=user_id)
    except UserToken.DoesNotExist:
        return None

    if user_token.token_expiry > datetime.now():
        return user_token.access_token  # Token is still valid

    # If token is expired, refresh it
    token_endpoint = "https://oauth2.googleapis.com/token"
    payload = {
        'client_id': settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET,
        'refresh_token': user_token.refresh_token,
        'grant_type': 'refresh_token'
    }

    response = requests.post(token_endpoint, data=payload)
    if response.status_code != 200:
        return None

    tokens = response.json()
    access_token = tokens.get('access_token')
    expires_in = tokens.get('expires_in')

    # Update token and expiry in the database
    user_token.access_token = access_token
    user_token.token_expiry = datetime.now() + timedelta(seconds=expires_in)
    user_token.save()

    return access_token


def fetch_user_sites(request):
    user_id = request.session.get('user_id', 'default_user')
    access_token = refresh_access_token(user_id)

    if not access_token:
        return JsonResponse({"error": "Unable to authenticate"}, status=401)

    url = "https://www.googleapis.com/webmasters/v3/sites"
    headers = {"Authorization": f"Bearer {access_token}"}

    response = requests.get(url, headers=headers)
    return JsonResponse(response.json())



    #     token_data = response.json()
    #     # Save the access and refresh tokens securely in your database
    #     access_token = token_data.get("access_token")
    #     refresh_token = token_data.get("refresh_token")

    #     # Return a success message
    #     return JsonResponse({"message": "Authorization successful", "access_token": access_token})
    # else:
    #     return JsonResponse({"error": "Failed to exchange token", "details": response.json()}, status=response.status_code)
