"""Данный модуль содержит реализацию алгоритма для решения задачи хакатона."""
import typing as tp
from datetime import datetime

import cv2
import numpy as np
from pydantic import BaseModel

from search.ml.zoo import ColorModel, TailModel, PetDetector, BreedModel, OCRModel
from .config import AnalyticsConfig


class BoundingBox(BaseModel):
    """Хранит результат работы алгоритма для одного животного."""

    top_left_x: float
    top_left_y: float
    height: float
    width: float
    animal_colors: tp.Dict[str, float]
    is_long_tail: float
    animal_breeds: tp.Dict[str, float]


class AnalyticsResult(BaseModel):
    """Хранит результаты работы аналитического сервиса."""
    
    boxes: tp.List[BoundingBox]
    camera_id: tp.Optional[str]
    snapshot_datetime: tp.Optional[datetime]


class PetAnalytics:
    """
    Класс, реализующий поиск животных на изображении и определения атрибутов 
    найденных животных.
    """

    def __init__(self, config: AnalyticsConfig) -> None:
        self._detector = PetDetector(config.detector)
        self._color_model = ColorModel(config.color_model)
        self._tail_model = TailModel(config.tail_model)
        self._breed_model = BreedModel(config.breed_model)
        self._ocr = OCRModel(config.ocr)

    def predict(self, image_bytes: bytes) -> AnalyticsResult:
        """
        Найти животное на изображении, распознать окрас его шерсти и длину его
        хвоста.

        Параметры:
            image_bytes: Байты изображения.

        Возвращает:
            Список с результатами работы алгоритма.
        """
        result = []

        # Передали что-то, что не является изображением.
        try:
            image = cv2.imdecode(
                np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR
            )
        except cv2.error:
            return AnalyticsResult(
                boxes=[], 
                camera_id=None, 
                snapshot_datetime=None
            )
        
        camera_id, snapshot_datetime = self._ocr.recognize(image)
        image_height, image_width = image.shape[:2]

        # Получаем боксы всех объектов, которые нам интересны и которые есть на
        # изображении. Тут будут боксы всех классов, которые мы определили в
        # конфигурационном файле.
        boxes, *_ = self._detector.detect(image)

        if not isinstance(boxes, list):
            for box in boxes:
                x0, y0, x1, y1 = box.astype(int)
                animal = np.ascontiguousarray(image[y0: y1, x0: x1, :])
                try:
                    color_dict = self._color_model.predict(animal)
                    long_tail_proba = self._tail_model.predict(animal)
                    breed_dict = self._breed_model.predict(animal)
                except cv2.error:

                    # Пришла битая картинка, поэтому OpenCV выдает ошибки.
                    # Нет смысла в дальнейшем анализе.
                    return AnalyticsResult(
                        boxes=[], 
                        camera_id=None, 
                        snapshot_datetime=None
                    )
                result.append(
                    BoundingBox(
                        top_left_x=(x0 / image_width),
                        top_left_y=(y0 / image_height),
                        height = ((y1 - y0) / image_height),
                        width = ((x1 - x0) / image_width),
                        animal_colors=color_dict,
                        is_long_tail=long_tail_proba,
                        animal_breeds=breed_dict
                    )
                )
        return AnalyticsResult(
            boxes=result, 
            camera_id=camera_id, 
            snapshot_datetime=snapshot_datetime
        )
