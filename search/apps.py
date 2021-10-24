from django.apps import AppConfig
from django.conf import settings

from search.ml.algorithm import PetAnalytics


class SearchConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'search'

    def ready(self):
        super().ready()
        self.pet_analytic = PetAnalytics(settings.ML_CONFIG)
