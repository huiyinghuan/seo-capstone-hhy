from django.db import models

# Create your models here.
# gsc/models.py
from django.db import models

class GSCAccountToken(models.Model):
    user_id = models.CharField(max_length=100, unique=True)
    access_token = models.TextField()
    refresh_token = models.TextField()
    token_expiry = models.DateTimeField()

class GSCAccountToken(models.Model):
    user = models.OneToOneField("auth.User", on_delete=models.CASCADE)
    access_token = models.CharField(max_length=255)
    refresh_token = models.CharField(max_length=255)
    token_expiry = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
