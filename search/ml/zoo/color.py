"""
Данный модуль содержит в себе определение модели для классификации оттенка 
цвета животного.
"""
import typing as tp

import numpy as np
import onnxruntime as ort
from scipy.special import softmax, expit

from .. import preprocessing
from ..config import ColorModelConfig


class ColorModel:
    """Класс, реализующий определение оттенка шерсти животного."""

    def __init__(self, config: ColorModelConfig) -> None:
        """
        Параметры:
            config: Конфигурация модели для определения оттенка шерсти.
        """
        self._session = ort.InferenceSession(config.weights_path)
        self.image_size = config.image_size
        self._color_classes = config.classes

    def predict(self, image: np.ndarray) -> tp.Dict[str, float]:
        """
        Определить вероятности оттенков шерсти животного.

        Параметры:
            image: Исходное изображение.

        Возвращает:
            Словарь с именами классов и соответствующими вероятностями.
        """
        tensor = preprocessing.preprocess_attr(image, self.image_size)
        ort_inputs = {self._session.get_inputs()[0].name: tensor}
        color_vector = self._session.run(None, ort_inputs)
        color_vector = softmax(color_vector[0][0])
        color_dict = {
            name: proba for name, proba in zip(self._color_classes, color_vector)
        }
        return color_dict
