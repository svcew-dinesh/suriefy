__author__ = 'dinesh'

from django.conf.urls import patterns, url
from user_data.views import Users, ApiUsers

urlpatterns = patterns('',
    url(r'^$', Users.as_view(), name='Users'),
    url(r'^userContacts', ApiUsers.as_view(), name='UsersApi'),
)