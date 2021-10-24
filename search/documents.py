from django_elasticsearch_dsl.search import Search
from elasticsearch_dsl import field
from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry

from search.models import DetectedObject
from search.vector import VectorBuilder


class DenseVector(fields.DEDField, field.DenseVector):
    pass


@registry.register_document
class DetectedObjectDocument(Document):
    vector = DenseVector(dims=VectorBuilder.length, attr='get_vector')

    class Index:
        name = 'detected_objects'

    class Django:
        model = DetectedObject

