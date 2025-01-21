from django.contrib import admin
from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings
from .views import seo_audit
from .googleOAuthRedirects import get_google_auth_url


urlpatterns = [
    path('admin/', admin.site.urls),
    path("", views.index, name="index"),
    path('seo-audit/', seo_audit, name='seo_audit'),
    path('api/sitemap/', views.get_sitemap, name='get_sitemap'),
    path('api/get-data/', views.get_data, name='get_data'),
    # path("auth-url/", get_google_auth_url, name="get_google_auth_url"),
   
   
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

