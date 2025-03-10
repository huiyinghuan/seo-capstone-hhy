import os
import json
import logging
import tempfile
from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from googleapiclient.discovery import build
from google.oauth2 import service_account


# Setup logger
logger = logging.getLogger(__name__)

# Global variable for the service account file
SERVICE_ACCOUNT_FILE = None
SCOPES = ['https://www.googleapis.com/auth/webmasters']
credentials = None
webmasters_service = None


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_auth_file(request):
    """Handle temporary upload of a service account JSON file and update authentication globally."""
    global SERVICE_ACCOUNT_FILE, credentials, webmasters_service

    if 'file' not in request.FILES:
        return Response({"error": "No file provided"}, status=400)

    uploaded_file = request.FILES['file']

    # Save the file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as temp_file:
        for chunk in uploaded_file.chunks():
            temp_file.write(chunk)
        SERVICE_ACCOUNT_FILE = temp_file.name  # Store the path in a global variable

    try:
        # Load the new service account file for authentication
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES
        )
        webmasters_service = build('webmasters', 'v3', credentials=credentials)

        # Optional: Test authentication by retrieving sites
        site_list = webmasters_service.sites().list().execute()
        sites = [site['siteUrl'] for site in site_list.get('siteEntry', [])]

        return Response({"message": "Authenticated successfully", "sites": sites}, status=200)

    except Exception as e:
        os.remove(SERVICE_ACCOUNT_FILE)  # Ensure cleanup on failure
        SERVICE_ACCOUNT_FILE = None  # Reset the global variable
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def get_sites(request):
    """Retrieve the list of verified sites."""
    if not webmasters_service:
        return JsonResponse({"error": "Service account file not uploaded"}, status=400)

    try:
        site_list = webmasters_service.sites().list().execute()
        sites = [site['siteUrl'] for site in site_list.get('siteEntry', [])]
        return JsonResponse({"sites": sites})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(['GET'])
def get_sitemaps(request):
    """Retrieve the list of sitemaps for a given site."""
    if not webmasters_service:
        return JsonResponse({"error": "Service account file not uploaded"}, status=400)

    site_url = request.GET.get('site_url')
    if not site_url:
        return JsonResponse({"error": "Missing 'site_url' parameter"}, status=400)

    try:
        sitemaps_response = webmasters_service.sitemaps().list(siteUrl=site_url).execute()
        sitemaps = [sitemap['path'] for sitemap in sitemaps_response.get('sitemap', [])]
        return JsonResponse({"sitemaps": sitemaps})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(['GET'])
def get_search_analytics(request):
    """Fetch search analytics data based on site and date range."""
    if not webmasters_service:
        return JsonResponse({"error": "Service account file not uploaded"}, status=400)

    site_url = request.GET.get('site_url')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if not all([site_url, start_date, end_date]):
        return JsonResponse({"error": "Missing required query parameters"}, status=400)

    request_body = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': ['date'],
        'rowLimit': 1000
    }

    try:
        response = webmasters_service.searchanalytics().query(
            siteUrl=site_url, body=request_body
        ).execute()
        rows = response.get('rows', [])
        data = [{'date': row['keys'][0], 'clicks': row['clicks'], 'impressions': row['impressions']} for row in rows]
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
