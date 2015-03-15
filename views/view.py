from django.conf import settings
from django.views.generic import TemplateView


class HomeView(TemplateView):

    def get_context_data(self, **kwargs):
        kwargs['settings'] = settings
        return kwargs

    def get_template_names(self):
        template_name = 'index.html'
        return [template_name]


class AdminView(TemplateView):

    def get_context_data(self, **kwargs):
        kwargs['settings'] = settings
        return kwargs

    def get_template_names(self):
        template_name = 'admin.html'
        return [template_name]
