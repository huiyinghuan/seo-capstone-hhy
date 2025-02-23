from django.contrib import admin
from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings
from .views import seo_audit
from . import gscFeature
#from .googleOAuthRedirects import get_google_auth_url
from . import recommedationFeature


urlpatterns = [
    # path('admin/', admin.site.urls),
    path("", views.index, name="index"),
    path('seo-audit/', seo_audit, name='seo_audit'),
    path('api/sitemap/', views.get_sitemap, name='get_sitemap'),
    path('api/get-data/', views.get_data, name='get_data'),
    # path("auth-url/", get_google_auth_url, name="get_google_auth_url"),
    # path('api/authorize', gscFeature.authorize_user, name='authorize'),
    path('api/get-sites', gscFeature.get_sites, name='get_sites'),
    path('api/get-sitemaps', gscFeature.get_sitemaps, name='get_sitemaps'),
    path('api/get-search-analytics', gscFeature.get_search_analytics, name='get_search_analytics'),
    path("api/get_recommended_fixes/", recommedationFeature.get_recommended_fixes, name="get_recommended_fixes"),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

