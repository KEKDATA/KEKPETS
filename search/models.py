import json

from django.db import models

from search.vector import VectorBuilder


class VidecamInfo(models.Model):
    videcam_id = models.CharField(max_length=100, db_index=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    ovd_phones = models.CharField(max_length=500, null=True, blank=True)


class VidecamFrame(models.Model):
    image = models.ImageField(upload_to='frames')
    info = models.ForeignKey(VidecamInfo, on_delete=models.SET_NULL, null=True, blank=True)
    filmed_at = models.DateTimeField(null=True, blank=True)


class DetectedObject(models.Model):
    color = models.CharField(max_length=1000)
    breed = models.CharField(max_length=4000)
    long_tail_proba = models.FloatField()
    top_left_x = models.FloatField()
    top_left_y = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    frame = models.ForeignKey(VidecamFrame, on_delete=models.CASCADE, related_name='detected_objects')

    def bbox(self):
        return f'{self.top_left_x},{self.top_left_y},{self.width},{self.height}'

    def get_vector(self):
        colors = json.loads(self.color)
        return VectorBuilder.build(colors, self.long_tail_proba)

    def get_breed(self):
        breeds = json.loads(self.breed)
        breed, _ = max(breeds.items(), key=lambda x: x[1])
        return breed
