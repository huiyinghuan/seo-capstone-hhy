import os
import json
from django.http import JsonResponse
from googleapiclient.discovery import build
from google.oauth2 import service_account
from rest_framework.decorators import api_view
from googleapiclient.errors import HttpError

import logging

# Setup logger
logger = logging.getLogger(__name__)


# Load Google Search Console API credentials
SERVICE_ACCOUNT_FILE = '/Users/huanhuiying/Documents/seo-capstone-hhy/seo-capstone-hhy.json'  # Update with your service account file path
SCOPES = ['https://www.googleapis.com/auth/webmasters']

# Initialize the Google API client
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)
webmasters_service = build('webmasters', 'v3', credentials=credentials)


# @api_view(['GET'])
# def authorize_user(request):
#     """Simulate an authorization endpoint."""
#     return JsonResponse({"message": "Successfully authorized using service account"})


@api_view(['GET'])
def get_sites(request):
    """Retrieve the list of verified sites."""
    try:
        site_list = webmasters_service.sites().list().execute()
        sites = [site['siteUrl'] for site in site_list.get('siteEntry', [])]
        return JsonResponse({"sites": sites})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(['GET'])
def get_sitemaps(request):
    """Retrieve the list of sitemaps for a given site."""
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
        data = [{'date': row['keys'][0], 'clicks': row['clicks']} for row in rows]
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
    
# @api_view(['GET'])
# def inspect_url(request):
#     try:
#         # Get site_url and url from request parameters
#         site_url = request.GET.get('site_url')
#         url = request.GET.get('url')

#         if not site_url or not url:
#             return JsonResponse({"error": "Missing site_url or url parameters"}, status=400)

#         # Call the URL inspection API
#         inspection =  webmasters_service.urlInspection().index().inspect(
#             siteUrl=site_url,
#             url=url
#         ).execute()

#         # Return the result as JSON
#         return JsonResponse(inspection)
    
#     except Exception as e:
#         return JsonResponse({"error": f"Error fetching URL inspection data: {str(e)}"}, status=500)
