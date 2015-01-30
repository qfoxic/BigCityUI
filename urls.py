from django.conf.urls import patterns, url
from views.view import HomeView

urlpatterns = patterns('',
    url(r'^$', HomeView.as_view(), name='home')
)
