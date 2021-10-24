"""
Данный модуль содержит в себе определение модели для классификации длины 
хвоста животного.
"""
import typing as tp

import numpy as np
import onnxruntime as ort
from scipy.special import expit

from .. import preprocessing
from ..config import TailModelConfig


class TailModel:
    """Класс, реализующий определение длины хвоста животного."""

    def __init__(self, config: TailModelConfig) -> None:
        """
        Параметры:
            config: Конфигурация модели для определения длины хвоста.
        """
        self._session = ort.InferenceSession(config.weights_path)
        self.image_size = config.image_size

    def predict(self, image: np.ndarray) -> float:
        """
        Определить вероятности того, что хвост длинный.

        Параметры:
            image: Исходное изображение.

        Возвращает:
            Вероятность того, что хвост длинный..
        """
        tensor = preprocessing.preprocess_attr(image, self.image_size)
        ort_inputs = {self._session.get_inputs()[0].name: tensor}
        long_tail_proba = self._session.run(None, ort_inputs)
        long_tail_proba = expit(long_tail_proba[0]).item()
        return long_tail_proba
