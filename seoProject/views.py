from django.shortcuts import render
from django import forms
from .forms import URLForm
import requests
from bs4 import BeautifulSoup
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
# Create your views here.
from django.http import HttpResponse
from .getHTML import fetch_html
from django.http import JsonResponse
from xml.etree import ElementTree as ET
from django.views.decorators.csrf import csrf_exempt
import json
import logging



def index(request):
    return render(request, 'index.html')

logger = logging.getLogger(__name__)

@csrf_exempt

def seo_audit(request):
    url = request.GET.get('url')
    if not url:
        return JsonResponse({'error': 'No URL provided'}, status=400)
    
    try:
        # Simulate fetch_html function or replace with actual logic
        html_type, seo_data = fetch_html(url)

        if html_type == "Failed":
            return JsonResponse({'error': 'Failed to fetch HTML or SEO data'}, status=500)

        # Fetch SEO data
        html_type, seo_data = fetch_html(url)
        if html_type == "Failed":
            return JsonResponse({'error': 'Failed to fetch HTML or SEO data'}, status=500)

        # Ensure keys in `seo_data` match what the frontend expects
        response = {
            'html_type': html_type,
            'title': seo_data.get('title', 'No title'),
            'meta_description': seo_data.get('meta_description', 'No meta description'),
            'canonical': seo_data.get('canonical', 'No canonical tag'),
            'robots': seo_data.get('robots', 'No robots meta tag'),
            'sitemap_status': seo_data.get('sitemap_status', 'No sitemap found'),
            'mobile_friendly': seo_data.get('mobile_friendly', 'Unknown'),
            'page_speed': seo_data.get('page_speed', 'Unknown'),
            'validation': seo_data.get('validation', {}),
            'httpsAuditResult':seo_data.get('httpsAuditResult','Unknown'),
            'headings': seo_data.get('headings', {}),
            'structured_data': seo_data.get('structured_data', []),
            'image_alt_text': seo_data.get('image_alt_text', {}),
            'structured_data_validation': seo_data.get('structured_data_validation', 'Default Value'),
            'keyword_density': seo_data.get('keyword_density', {}),
            'flesch_reading_ease':seo_data.get('flesch_reading_ease', 'Unknown')

        }
        return JsonResponse(response)
    except Exception as e:
        # Log the error in real scenarios
        print(f"Error fetching SEO data: {e}")
        return JsonResponse({'error': 'Internal server error'}, status=500)


def get_sitemap(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            url = data.get("url")

            if not url:
                return JsonResponse({"error": "URL not provided"}, status=400)

            # Validate URL
            validator = URLValidator()
            try:
                validator(url)
            except ValidationError:
                return JsonResponse({"error": "Invalid URL provided"}, status=400)

            # Append `/sitemap.xml` to the provided URL
            sitemap_url = f"{url.rstrip('/')}/sitemap.xml"

            # Fetch sitemap
            response = requests.get(sitemap_url, timeout=10)
            response.raise_for_status()

            # Parse the XML content
            root = ET.fromstring(response.content)
            namespaces = {'ns': root.tag.split('}')[0].strip('{')} if '}' in root.tag else {}
            urls = [url.find('ns:loc', namespaces).text for url in root.findall('ns:url', namespaces)]

            return JsonResponse({"urls": urls}, status=200)
        except requests.Timeout:
            return JsonResponse({"error": "Request timed out. Please try again later."}, status=504)
        except requests.RequestException as e:
            logger.error(f"RequestException: {str(e)}")
            return JsonResponse({"error": f"HTTP error: {str(e)}"}, status=500)
        except ET.ParseError as e:
            logger.error(f"ParseError: {str(e)}")
            return JsonResponse({"error": "Invalid sitemap format"}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


# @csrf_exempt  # Bypass CSRF for simplicity; in production, configure CSRF properly
# def get_sitemap(request):
#     if request.method == "POST":
#         data = json.loads(request.body)
#         url = data.get("url")
        
#         if not url:
#             return JsonResponse({"error": "URL is required"}, status=400)

#         sitemap_urls = []
#         try:
#             # Append "/sitemap.xml" if necessary
#             sitemap_url = url if url.endswith("/sitemap.xml") else f"{url}/sitemap.xml"
#             response = requests.get(sitemap_url)
#             response.raise_for_status()

#             # Parse XML content
#             soup = BeautifulSoup(response.content, "xml")
#             sitemap_urls = [loc.text for loc in soup.find_all("loc")]

#             return JsonResponse({"sitemap_urls": sitemap_urls}, status=200)
        
#         except requests.RequestException as e:
#             return JsonResponse({"error": f"Error fetching sitemap: {e}"}, status=500)

#     return JsonResponse({"error": "Invalid request method"}, status=405)

# @csrf_exempt
# def get_sitemap(request):
#     if request.method == "POST":
#         data = json.loads(request.body)
#         url = data.get("url")
#     elif request.method == "GET":
#         url = request.GET.get("url")
#     else:
#         return JsonResponse({"error": "Invalid request method"}, status=405)

#     if not url:
#         return JsonResponse({"error": "URL is required"}, status=400)

#     sitemap_urls = []
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON data"}, status=400)
#         url = data.get("url")

#     if not sitemap_urls:
#         return JsonResponse({"error": "No URLs found in the sitemap"}, status=404)



#     try:
#         # Append "/sitemap.xml" if necessary
#         sitemap_url = url if url.endswith("/sitemap.xml") else f"{url}/sitemap.xml"
#         response = requests.get(sitemap_url)
#         response.raise_for_status()

#         # Parse XML content
#         soup = BeautifulSoup(response.content, "xml")
#         sitemap_urls = [loc.text for loc in soup.find_all("loc")]

#         return JsonResponse({"sitemap_urls": sitemap_urls}, status=200)
    
#     except requests.RequestException as e:
#         return JsonResponse({"error": f"Error fetching sitemap: {e}"}, status=500)

from django.http import JsonResponse

def get_data(request):
    data = {"message": "Hello from Django backend!"}
    return JsonResponse(data)
