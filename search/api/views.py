from random import choices

import django_filters
from django.db import models
from django_filters import rest_framework as filters, ChoiceFilter
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination

from search.api.serializers import DetectedObjectSerializer
from search.documents import DetectedObjectDocument
from search.models import DetectedObject
from search.vector import VectorBuilder


class AnimalSearchFilter(django_filters.FilterSet):

    class AnimalTypes(models.TextChoices):
        DOG = 'dog'

    class Tails(models.TextChoices):
        LONG = 'long'
        SHORT = 'short'

    class Colors(models.TextChoices):
        BRIGHT = 'bright'
        DARK = 'dark'
        GINGER = 'ginger'
        MULTI_COLOR = 'multi_color'

    type = ChoiceFilter(choices=AnimalTypes.choices)
    tail = ChoiceFilter(choices=Tails.choices)
    color = ChoiceFilter(choices=Colors.choices)

    class Meta:
        model = DetectedObject
        fields = ['type', 'color', 'tail', 'breed']

    def filter_queryset(self, queryset):
        if self.form.cleaned_data['tail'] == self.Tails.LONG:
            long_tail_proba = 1.0
        elif self.form.cleaned_data['tail'] == self.Tails.SHORT:
            long_tail_proba = 0.0
        else:
            long_tail_proba = 0.5

        vector = VectorBuilder.build(
            colors={self.form.cleaned_data['color']: 1.0},
            breeds={self.form.cleaned_data['breed']: 1.0},
            long_tail_proba=long_tail_proba,
        )
        script = {
            'source': "cosineSimilarity(params.query_vector, 'vector')",
            'params': {'query_vector': vector}
        }
        query = {'match_all': {}}
        queryset = (
            DetectedObjectDocument.search()
            .query('script_score', script=script, query=query)
            .to_queryset()
            .select_related('frame', 'frame__info')
        )
        return queryset

class AnimalSearch(ListAPIView):
    queryset = DetectedObject.objects.select_related('frame', 'frame__info')
    serializer_class = DetectedObjectSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = AnimalSearchFilter
    pagination_class = PageNumberPagination
