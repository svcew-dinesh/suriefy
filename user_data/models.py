from django.db import models

# Create your models here.

class users(models.Model):
    name = models.CharField(max_length=200,blank=False)
    email = models.CharField(max_length=200,blank=False)
    gender = models.CharField(max_length=200,blank=False)
    address = models.CharField(max_length=200,blank=False)
    city = models.CharField(max_length=200,blank=False)
    state = models.CharField(max_length=200,blank=False)
    zip = models.IntegerField(max_length=6,blank=False)
    phone = models.IntegerField(max_length=10,blank=False)
