from typing import Optional, List

from drf_yasg.utils import swagger_serializer_method
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from search.models import DetectedObject


class DetectedObjectSerializer(ModelSerializer):
    image = serializers.URLField(source='frame.image.url')
    date = serializers.DateTimeField(source='frame.filmed_at')
    address = serializers.SerializerMethodField()
    ovd_phones = serializers.SerializerMethodField()

    class Meta:
        model = DetectedObject
        fields = ('id', 'bbox', 'image', 'date', 'address', 'ovd_phones')

    def get_address(self, obj) -> Optional[str]:
        if obj.frame and obj.frame.info:
            return obj.frame.info.address

    @swagger_serializer_method(serializer_or_field=serializers.ListField(child=serializers.CharField()))
    def get_ovd_phones(self, obj) -> List[str]:
        if obj.frame and obj.frame.info:
            return obj.frame.info.ovd_phones.split(',')
        return []
