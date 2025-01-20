# from django.http import JsonResponse
# import requests
# from decouple import config

# # Load credentials from .env file
# CLIENT_ID = config("REACT_APP_GOOGLE_CLIENT_ID")
# CLIENT_SECRET = config("REACT_APP_GOOGLE_CLIENT_SECRET")
# REDIRECT_URI = config("REACT_APP_GOOGLE_REDIRECT_URI")

# def google_auth_callback(request):
#     # Get the authorization code from the query params
#     code = request.GET.get("code")
#     if not code:
#         return JsonResponse({"error": "Authorization code not provided"}, status=400)

#     # Exchange the authorization code for an access token
#     token_url = "https://oauth2.googleapis.com/token"
#     data = {
#         "code": code,
#         "client_id": CLIENT_ID,
#         "client_secret": CLIENT_SECRET,
#         "redirect_uri": REDIRECT_URI,
#         "grant_type": "authorization_code",
#     }

#     response = requests.post(token_url, data=data)
#     if response.status_code == 200:
#         token_data = response.json()
#         # Save the access and refresh tokens securely in your database
#         access_token = token_data.get("access_token")
#         refresh_token = token_data.get("refresh_token")

#         # Return a success message
#         return JsonResponse({"message": "Authorization successful", "access_token": access_token})
#     else:
#         return JsonResponse({"error": "Failed to exchange token", "details": response.json()}, status=response.status_code)


# views.py
# from django.http import JsonResponse
# from google.oauth2.credentials import Credentials
# from google.auth.transport.requests import Request
# from google_auth_oauthlib.flow import Flow
# from googleapiclient.discovery import build
# from django.conf import settings
# import json

# class GSCIntegration:
#     def initiate_auth(request):
#         # Configure the OAuth2 flow
#         flow = Flow.from_client_secrets_file(
#             'seoProject/client_secret.json',
#             scopes=['https://www.googleapis.com/auth/webmasters.readonly'],
#             redirect_uri='http://localhost:3000/oauth2/callback'
#         )
        
#         # Generate authorization URL
#         auth_url = flow.authorization_url()
        
#         # Store the state in session for verification later
#         request.session['gsc_auth_state'] = auth_url[1]
        
#         return JsonResponse({'auth_url': auth_url[0]})
    
#     def auth_callback(request):
#         try:
#             flow = Flow.from_client_secrets_file(
#                 'seoProject/client_secret.json',
#                 scopes=['https://www.googleapis.com/auth/webmasters.readonly'],
#                 state=request.session['gsc_auth_state']
#             )
            
#             flow.fetch_token(
#                 authorization_response=request.build_absolute_uri(),
#             )
            
#             credentials = flow.credentials
#             # Store credentials securely (you might want to encrypt these)
#             request.session['gsc_credentials'] = {
#                 'token': credentials.token,
#                 'refresh_token': credentials.refresh_token,
#                 'token_uri': credentials.token_uri,
#                 'client_id': credentials.client_id,
#                 'client_secret': credentials.client_secret,
#             }
            
#             return JsonResponse({'status': 'success'})
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=400)
    
#     def fetch_gsc_data(request):
#         try:
#             # Retrieve stored credentials
#             stored_credentials = request.session.get('gsc_credentials')
#             if not stored_credentials:
#                 return JsonResponse({'error': 'Not authenticated'}, status=401)
            
#             credentials = Credentials.from_authorized_user_info(stored_credentials)
            
#             # Build the service
#             service = build('searchconsole', 'v1', credentials=credentials)
            
#             # Example query to fetch search analytics data
#             response = service.searchanalytics().query(
#                 siteUrl='your-site-url',
#                 body={
#                     'startDate': '2024-01-01',
#                     'endDate': '2024-01-31',
#                     'dimensions': ['query'],
#                     'rowLimit': 10
#                 }
#             ).execute()
            
#             return JsonResponse(response)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=400)


from django.http import JsonResponse
from django.conf import settings
import urllib.parse
import logging
from decouple import config
from datetime import datetime, timedelta
from .models import GSCAccountToken
import requests

logger = logging.getLogger(__name__)


# Load values from the .env file
GOOGLE_CLIENT_ID = config("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = config("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = config("GOOGLE_REDIRECT_URI")

def get_google_auth_url(request):
    try:
        SCOPE = "https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/webmasters.readonly"
        # Build the authorization URL
        base_url = "https://accounts.google.com/o/oauth2/v2/auth"
        query_params = {
            "client_id": GOOGLE_CLIENT_ID,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "response_type": "code",
            "scope": SCOPE,
            "access_type": "offline",
        }
        auth_url = f"{base_url}?{urllib.parse.urlencode(query_params)}"
        logger.info(f"Generated auth URL: {auth_url}")
        return JsonResponse({"auth_url": auth_url})
    except Exception as e:
        logger.error(f"Error generating auth URL: {e}")
        return JsonResponse({"error": str(e)}, status=500)
    
    # return JsonResponse({"auth_url": auth_url})

def oauth_callback(request):
    code = request.GET.get('code')  # The authorization code returned by Google
    
    if not code:
        return JsonResponse({"error": "Missing authorization code"}, status=400)

    try:
        # Exchange the authorization code for an access token
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            'code': code,
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'redirect_uri': GOOGLE_REDIRECT_URI,
            'grant_type': 'authorization_code',
        }
        
        response = requests.post(token_url, data=data)
        response_data = response.json()

        if 'access_token' in response_data:
            access_token = response_data['access_token']
            refresh_token = response_data.get('refresh_token', None)  # Optional: Store refresh token
            # Save the access token securely (e.g., in a session or database)
            
            return JsonResponse({"access_token": access_token, "refresh_token": refresh_token})
        else:
            return JsonResponse({"error": "Failed to obtain access token", "details": response_data}, status=500)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

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
