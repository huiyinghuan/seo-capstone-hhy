from django.shortcuts import render
from django import forms
from .forms import URLForm
import requests
from bs4 import BeautifulSoup

# Create your views here.
from django.http import HttpResponse

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


def index(request):
    return HttpResponse("Hello, world. You're at the SEO Main Page.")

def sitemap_view(request):
    sitemap_urls = []
    error = None

    if request.method == "POST":
        form = URLForm(request.POST)
        if form.is_valid():
            url = form.cleaned_data["url"]
            try:
                # Fetch and parse sitemap
                sitemap_url = url if url.endswith("/sitemap.xml") else f"{url}/sitemap.xml"
                response = requests.get(sitemap_url)
                response.raise_for_status()

                soup = BeautifulSoup(response.content, "xml")
                sitemap_urls = [loc.text for loc in soup.find_all("loc")]
            except requests.RequestException as e:
                error = f"Error fetching sitemap: {e}"
            except Exception as e:
                error = f"An error occurred: {e}"
    else:
        form = URLForm()

    return render(request, "seoProject/sitemap_view.html", {
        "form": form,
        "sitemap_urls": sitemap_urls,
        "error": error
    })


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
