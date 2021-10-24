"""
Данный модуль содержит в себе определение модели классификации породы собак.
"""
import typing as tp

import numpy as np
import onnxruntime as ort
from scipy.special import softmax

from .. import preprocessing
from ..config import BreedModelConfig


class BreedModel:
    """Класс, реализующий определение породы собаки."""

    def __init__(self, config: BreedModelConfig) -> None:
        """
        Параметры:
            config: Конфигурация модели атрибутов животных.
        """
        self._session = ort.InferenceSession(config.weights_path)
        self.image_size = config.image_size
        self._breed_classes = config.classes

    def predict(self, image: np.ndarray) -> tp.Dict[str, float]:
        """
        Определить вероятности классов породы собаки.

        Параметры:
            image: Исходное изображение.

        Возвращает:
            Вектора вероятностей.
        """
        tensor = preprocessing.preprocess_attr(image, self.image_size)
        ort_inputs = {self._session.get_inputs()[0].name: tensor}
        breed_vector = self._session.run(None, ort_inputs)
        breed_vector = softmax(breed_vector[0][0])
        breed_dict = {
            name: proba for name, proba in zip(self._breed_classes, breed_vector)
        }
        return breed_dict
