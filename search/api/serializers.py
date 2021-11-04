from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from search.models import DetectedObject


class DetectedObjectSerializer(ModelSerializer):
    image = serializers.URLField(source='frame.image.url')
    date = serializers.DateTimeField(source='frame.filmed_at')
    address = serializers.SerializerMethodField()

    class Meta:
        model = DetectedObject
        fields = ('id', 'bbox', 'image', 'date', 'address')

    def get_address(self, obj):
        if obj.frame and obj.frame.info:
            return obj.frame.info.address
