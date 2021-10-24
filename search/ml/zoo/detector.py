"""Данный модуль содержит в себе определение модели детектора животных."""
import typing as tp

import numpy as np
import onnxruntime as ort

from .. import preprocessing
from .. import postprocessing
from ..config import DetectorConfig

Boxes = tp.Union[np.ndarray, tp.List]
Scores = tp.Union[np.ndarray, tp.List]
Classes = tp.Union[np.ndarray, tp.List]
Detection = tp.Tuple[Boxes, Scores, Classes]


class PetDetector:
    """Класс, реализующий детектирование животных на изображении."""

    __COCO_CLASSES = (
        "person",
        "bicycle",
        "car",
        "motorcycle",
        "airplane",
        "bus",
        "train",
        "truck",
        "boat",
        "traffic light",
        "fire hydrant",
        "stop sign",
        "parking meter",
        "bench",
        "bird",
        "cat",
        "dog",
        "horse",
        "sheep",
        "cow",
        "elephant",
        "bear",
        "zebra",
        "giraffe",
        "backpack",
        "umbrella",
        "handbag",
        "tie",
        "suitcase",
        "frisbee",
        "skis",
        "snowboard",
        "sports ball",
        "kite",
        "baseball bat",
        "baseball glove",
        "skateboard",
        "surfboard",
        "tennis racket",
        "bottle",
        "wine glass",
        "cup",
        "fork",
        "knife",
        "spoon",
        "bowl",
        "banana",
        "apple",
        "sandwich",
        "orange",
        "broccoli",
        "carrot",
        "hot dog",
        "pizza",
        "donut",
        "cake",
        "chair",
        "couch",
        "potted plant",
        "bed",
        "dining table",
        "toilet",
        "tv",
        "laptop",
        "mouse",
        "remote",
        "keyboard",
        "cell phone",
        "microwave",
        "oven",
        "toaster",
        "sink",
        "refrigerator",
        "book",
        "clock",
        "vase",
        "scissors",
        "teddy bear",
        "hair drier",
        "toothbrush"
    )

    def __init__(self, config: DetectorConfig) -> None:
        """
        Параметры:
            config: Конфигурация модели детектора животных.
        """
        self._session = ort.InferenceSession(config.weights_path)
        self.nms_thresh = config.nms_thresh
        self.score_thresh = config.score_thresh
        self.image_size = config.image_size
        self._class_indices = [
            self.__COCO_CLASSES.index(cls_) for cls_ in config.accepted_classes
        ]

    def detect(self, image: np.ndarray) -> Detection:
        """
        Найти животных на изображении.

        Параметры:
            image: Исходное изображение.

        Возвращае:
            Найденные обрамляющие прямоугольники, вероятности и классы.
        """
        
        # Предобратабываем картинку.
        img, ratio = preprocessing.preprocess(image.copy(), self.image_size)

        # Прогоняем изображение через нейронную сеть.
        ort_inputs = {self._session.get_inputs()[0].name: img[None, :, :, :]}
        output = self._session.run(None, ort_inputs)

        # Производим постобработку результатов нейронной сети.
        predictions = postprocessing.postprocess(
            output[0], self.image_size, p6=False
        )[0]
        boxes = predictions[:, :4]
        scores = predictions[:, 4:5] * predictions[:, 5:]
        boxes_xyxy = np.ones_like(boxes)
        boxes_xyxy[:, 0] = boxes[:, 0] - boxes[:, 2]/2.
        boxes_xyxy[:, 1] = boxes[:, 1] - boxes[:, 3]/2.
        boxes_xyxy[:, 2] = boxes[:, 0] + boxes[:, 2]/2.
        boxes_xyxy[:, 3] = boxes[:, 1] + boxes[:, 3]/2.
        boxes_xyxy /= ratio
        dets = postprocessing.multiclass_nms_class_aware(
            boxes_xyxy, 
            scores, 
            nms_thr=self.nms_thresh, 
            score_thr=self.score_thresh
        )

        # Если ничего не нашли, то возвращаем пустые списки.
        if dets is None:
            return [], [], []

        # Производим фильтрацию найденных объектов по классам интереса.
        final_boxes = dets[:, :4]
        final_scores = dets[:, 4]
        final_cls_inds = dets[:, 5]
        filtered_by_class = []
        for valid_cls_index in self._class_indices:
            filtered_by_class.extend(
                np.where(final_cls_inds == valid_cls_index)[0]
            )
        final_boxes = final_boxes[filtered_by_class]
        final_scores = final_scores[filtered_by_class]
        final_cls_inds = final_cls_inds[filtered_by_class]
        return final_boxes, final_scores, final_cls_inds
