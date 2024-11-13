from django.urls import path

from . import views

urlpatterns = [
    path('api/get-data/', views.get_data, name='get_data'),
    path("", views.index, name="index"),
]

