from django.conf.urls import patterns, url
from views.view import HomeView, AdminView

urlpatterns = patterns('',
    url(r'^$', HomeView.as_view(), name='home'),
    url(r'^admin/$', AdminView.as_view(), name='admin')
)
