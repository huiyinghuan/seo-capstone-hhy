from django.contrib import admin
from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings
from .views import seo_audit
from .googleOAuthRedirects import google_auth_callback

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", views.index, name="index"),
    path('seo-audit/', seo_audit, name='seo_audit'),
    path('api/sitemap/', views.get_sitemap, name='get_sitemap'),
    path('api/get-data/', views.get_data, name='get_data'),
    path("auth/google/callback", google_auth_callback, name="google-auth-callback"),
]

