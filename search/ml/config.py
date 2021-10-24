"""Данный модуль хранит объекты конфигурации проекта."""
import typing as tp

import yaml
from pydantic import BaseModel


class DetectorConfig(BaseModel):
    """Хранит настройки детектора животных."""

    image_size: tp.List[int]
    weights_path: str
    score_thresh: float
    nms_thresh: float
    accepted_classes: tp.List[str]


class ColorModelConfig(BaseModel):
    """Хранит настройки модели, определяющей оттенок шерсти."""

    image_size: tp.List[int]
    weights_path: str
    classes: tp.List[str]


class TailModelConfig(BaseModel):
    """Хранит настройки модели, определяющей длину хвоста."""

    image_size: tp.List[int]
    weights_path: str


class BreedModelConfig(BaseModel):
    """Хранит настройки модели, определяющий атрибуты найденных животных."""

    image_size: tp.List[int]
    weights_path: str
    classes: tp.List[str]


class OCRConfig(BaseModel):
    """Хранит настройки OCR модели."""

    id_prefixes: tp.List[str]
    max_pixel_intensity: int
    min_pixel_intensity: int


class AnalyticsConfig(BaseModel):
    """Хранит настройки всего конвеера моделей."""
    detector: DetectorConfig
    color_model: ColorModelConfig
    tail_model: TailModelConfig
    breed_model: BreedModelConfig
    ocr: OCRConfig


def get_config(path_to_cfg: str) -> AnalyticsConfig:
    """
    Распарсить .YANL файл с конфигурацией проекта и построить объект
    конфигурации.
    
    Параметры:
        path_to_cfg: Путь до .YAML файла.

    Returns:
        Объект с конфигурациями проекта.
    """
    with open(path_to_cfg, 'r') as yf:
        yml_file = yaml.safe_load(yf)
        config = AnalyticsConfig.parse_obj(yml_file)
    return config
