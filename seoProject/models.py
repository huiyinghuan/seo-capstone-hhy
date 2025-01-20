from django.db import models

# Create your models here.
# gsc/models.py
from django.db import models

class GSCAccountToken(models.Model):
    user_id = models.CharField(max_length=100, unique=True)
    access_token = models.TextField()
    refresh_token = models.TextField()
    token_expiry = models.DateTimeField()
