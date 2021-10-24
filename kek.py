import os
from datetime import date

import django

os.environ["DJANGO_SETTINGS_MODULE"] = 'conf.settings'
django.setup()

from django.core.files.storage import DefaultStorage
from django.contrib.auth import get_user_model

from search.models import DetectedObject, VidecamFrame

if __name__ == '__main__':
    frame = VidecamFrame.objects.get()
    print(frame.image)
    print(type(frame.image.storage))
    print(*dir(frame.image), sep='\n')
    # print(*dir(frame.image.storage), sep='\n')
    # print(type(frame.image.storage.open()))
    r = frame.image.read()
    print(r)
    print(type(r))















