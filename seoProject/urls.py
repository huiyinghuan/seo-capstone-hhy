from django.contrib import admin
from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", views.index, name="index"),
    path('api/get-data/', views.get_data, name='get_data')
    
]

