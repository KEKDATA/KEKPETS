"""
Данный модуль содержит в себе функции предобработки изображений перед подачей 
их в модели.
"""
import typing as tp

import cv2
import numpy as np

PADDING_COLOR = (0, 0, 0)
MAX_PIXEL_INTENSITY = 255
IMAGENET_CHANNELS_MEAN = (0.485, 0.456, 0.406)
IMAGENET_CHANNELS_STD = (0.229, 0.224, 0.225)


def preprocess(
    img: np.ndarray, 
    input_size: tp.Tuple[int, int], 
    swap: tp.Tuple[int, int, int] = (2, 0, 1),
    bg_color: int = 114
) -> tp.Tuple[np.ndarray, int]:
    """
    Перевести изображения в тензор с указанными размерами для детектора.

    Параметры:
        img: Исходное изображение;
        input_size: Размер тензора;
        swap: Правило перестановки размерностей тензора;
        bg_color: Цвет фона.

    Возвращает:
        Тензор и отступы для паддинга.
    """
    if len(img.shape) == 3:
        padded_img = np.ones(
            (input_size[0], input_size[1], 3), dtype=np.uint8) * bg_color
    else:
        padded_img = np.ones(input_size, dtype=np.uint8) * bg_color

    r = min(input_size[0] / img.shape[0], input_size[1] / img.shape[1])
    resized_img = cv2.resize(
        img,
        (int(img.shape[1] * r), int(img.shape[0] * r)),
        interpolation=cv2.INTER_LINEAR,
    ).astype(np.uint8)
    padded_img[: int(img.shape[0] * r), : int(img.shape[1] * r)] = resized_img
    padded_img = padded_img.transpose(swap)
    padded_img = np.ascontiguousarray(padded_img, dtype=np.float32)
    return padded_img, r


def pad_to_square(image: np.ndarray) -> np.ndarray:
    """
    Авто-дополнение нулями изображения до квадратного размера.

    Parameters:
        image: Исходное изображение.

    Returns:
        Дополненное изображение.
    """
    image_height, image_width = image.shape[:2]
    square_size = max(image_height, image_width)
    height_offset = (square_size - image_height) // 2
    width_offset = (square_size - image_width) // 2
    return cv2.copyMakeBorder(
        image,
        height_offset,
        height_offset,
        width_offset,
        width_offset,
        borderType=cv2.BORDER_CONSTANT,
        value=PADDING_COLOR,
    )


def preprocess_attr(image: np.ndarray, target_size: tp.List[int]) -> np.ndarray:
    """
    Перевести изображения в тензор с указанными размерами для модели 
    классификации атрибутов животного..

    Параметры:
        image: Исходное изображение;
        target_size: Размер тензора;
        
    Возвращает:
        Тензор.
    """
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    tensor = image.astype(np.float32)
    tensor = pad_to_square(tensor)
    tensor = cv2.resize(tensor, tuple(target_size))
    tensor /= MAX_PIXEL_INTENSITY
    tensor = np.transpose(tensor, (2, 0, 1))
    tensor -= np.array(IMAGENET_CHANNELS_MEAN)[:, None, None]
    tensor /= np.array(IMAGENET_CHANNELS_STD)[:, None, None]
    return np.expand_dims(tensor, axis=0)
