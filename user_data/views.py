# Create your views here.

import json
import json as simplejson

from django.views.generic import View
from django.shortcuts import render
from django.http import HttpResponse
from django.core.cache import get_cache

from .models import users


# cached for 1 day
cache_timeout = 86400


# get cached data across the site
def get_users_cache():
    usersCache = get_cache("suriefyCache")
    return usersCache


# user class
class Users(View):
    # this is a get method to load index.html page and render it
    def get(self, request):
        return render(request, 'user_data/index.html')


# this is a api class
class ApiUsers(View):
    # this is a get method to get all users data from DB and storing into cached data
    # cache_format --->
    #     mongoID: relative row
    # if cache is there, then directly we access that data
    def get(self, request):
        cachedData = get_users_cache()
        keys = cachedData.keys("*")
        values = []
        if len(keys) == 0:
            data = list(users.objects.values())
            for row in data:
                cachedData.set(row.get("id"), row, cache_timeout)
            keys = cachedData.keys("*")
        for key in keys:
            values.append(cachedData.get(key))
        return HttpResponse(simplejson.dumps(values), content_type="application/json")


    # this is a post method to add new user data to DB and
    # then that is stored into cache
    def post(self, request):
        try:
            data = json.loads(request.body)
            users_details = users(
                name=data.get("name", ""),
                email=data.get("email", ""),
                gender=data.get("gender", ""),
                address=data.get("address", ""),
                city=data.get("city", ""),
                state=data.get("state", ""),
                zip=data.get("zip", ""),
                phone=data.get("phone", "")
            )
            users_details.save()
            cachedData = get_users_cache()
            cachedData.set(users_details.id,
                           {'id': users_details.id, 'name': users_details.name, 'email': users_details.email,
                            'gender': users_details.gender, 'address': users_details.address,
                            'city': users_details.city, 'state': users_details.state,
                            'zip': users_details.zip, 'phone': users_details.phone}, cache_timeout)
            return HttpResponse({"success": "success"})
        except Exception as e:
            return HttpResponse({"error": str(e)})


    # this is a put method to update existing user data in DB and
    # then updated into cache
    def put(self, request):
        try:
            data = json.loads(request.body)
            newData = users.objects.get(id=data.get("id"))
            newData.name = data.get("name")
            newData.email = data.get("email")
            newData.gender = data.get("gender")
            newData.address = data.get("address")
            newData.city = data.get("city")
            newData.state = data.get("state")
            newData.zip = data.get("zip")
            newData.phone = data.get("phone")
            newData.save()
            cachedData = get_users_cache()
            cachedData.delete(newData.id)
            cachedData.set(newData.id, {'id': newData.id, 'name': newData.name, 'email': newData.email,
                                        'gender': newData.gender, 'address': newData.address, 'city': newData.city,
                                        'state': newData.state,
                                        'zip': newData.zip, 'phone': newData.phone}, cache_timeout)
            return HttpResponse({"success": "success"}, 200)
        except Exception as e:
            return HttpResponse({"error": str(e)}, 500)


    # this is a delete method to delete existing user data in DB and
    # then deleting into cache
    def delete(self, request):
        try:
            id = request.GET.get("id")
            newData = users.objects.get(id=id)
            newData.delete()
            cachedData = get_users_cache()
            cachedData.delete(id)
            return HttpResponse({"success": "success"}, 200)
        except Exception as e:
            return HttpResponse({"error": str(e)}, 500)
