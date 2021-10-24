from django.urls import path

from search.api.views import AnimalSearch

app_name = 'videcamfarme'


urlpatterns = [
    path('', AnimalSearch.as_view(), name='search'),
]