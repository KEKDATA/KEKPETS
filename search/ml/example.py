import os
import cv2
from KEKPETS_ML.algorithm import PetAnalytics
from KEKPETS_ML.config import get_config


if __name__ == '__main__':
    config = get_config('KEKPETS_ML/config.yml')
    pet = PetAnalytics(config)

    for subfolder in os.scandir('data/dataset'):
        if subfolder.name.startswith('.'):
            continue
        for image_file in os.scandir(subfolder.path):
            if image_file.name.startswith('.'):
                continue
            image_ext = os.path.splitext(image_file.name)[-1]
            try:
                image = cv2.imread(image_file.path)
                image = cv2.imencode(image_ext, image)[1].tobytes()
            except cv2.error:
                continue
            predictions = pet.predict(image)
