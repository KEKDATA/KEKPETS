"""Данный модуль содержит в себе определение OCR модели."""
import re
import typing as tp
from datetime import datetime

import cv2
import numpy as np
import pytesseract

from ..config import OCRConfig
     

class OCRModel:

    # Срезы для определния часа, минуты и секунды после OCR процедуры.
    _HOUR = slice(0, 2)
    _MINUTE = slice(2, 4)
    _SECOND = slice(4, 6)

    # Отображение текстового написания месяца в номер месяца.
    _MONTH_MAPPER = {
        'сент': 9,
        'авг': 8,
        'окт': 10,
        'июля': 7,
        'июня': 6
    }

    def __init__(self, config: OCRConfig) -> None:
        self._prefixes = config.id_prefixes
        self._max_pixel_intensity = config.max_pixel_intensity
        self._min_pixel_intensity = config.min_pixel_intensity

    def recognize(self, image: np.ndarray) -> tp.Tuple[tp.Optional[str], tp.Optional[str]]:
        text_patch = self._preprocess_patch(image[0:65, 5: 300])
        camera_id_indices, date_indices = self.find_text_indices(text_patch)
        if camera_id_indices is None:
            camera_id = None
        else:
            camera_id = self._postprocess_camera_id(
                self._postprocess_text(
                    pytesseract.image_to_string(text_patch[camera_id_indices, :]),
                    replace=True
                )
            )

            if camera_id is None or camera_id[-1].isalpha():
                camera_id = self._postprocess_camera_id(
                    self._postprocess_text(
                        pytesseract.image_to_string(text_patch[camera_id_indices, 39: 170]),
                        replace=True
                    )
                )
            if camera_id is not None:
                prefix = camera_id.split('_')[0]
                if len(prefix) == 2:
                    camera_id = self._postprocess_camera_id(
                        self._postprocess_text(
                            pytesseract.image_to_string(text_patch[camera_id_indices, 4:]),
                            replace=True
                        )
                    )
        if date_indices is None:
            date = None
        else:
            date = self._postprocess_date(
                self._postprocess_text(
                    pytesseract.image_to_string(text_patch[date_indices, 3:], lang='rus')
                )
            )
            if date is None:
                date = self._postprocess_date(
                    self._postprocess_text(
                        pytesseract.image_to_string(text_patch[date_indices, :110], lang='rus')
                    )
                )
            if date is None:
                date = self._postprocess_date(
                    self._postprocess_text(
                        pytesseract.image_to_string(text_patch[date_indices, 3:130], lang='rus')
                    )
                )
        return camera_id, date

    def _preprocess_patch(self, patch: np.ndarray) -> np.ndarray:
        """
        Произвести предобработку патча с текстом. Это нужно, чтобы
        распознавание было более устойчивым к ошибкам.

        Параметры:
            patch: Патч с текстом.

        Возвращает:
            Бинаризованный патч с текстом.
        """
        patch = cv2.cvtColor(patch, cv2.COLOR_BGR2GRAY)
        patch = cv2.threshold(
            patch,
            self._min_pixel_intensity,
            self._max_pixel_intensity,
            cv2.THRESH_BINARY_INV
        )[1]
        return patch

    def _postprocess_text(self, text: str, replace: bool=False) -> str:
        """
        Произвести первичную постобработку распознанного текста.

        Параметры:
            text: Распознанный текст.

        Возвращает:
            Обработанный текст.
        """
        accepted_symbols = ('_', ' ')
        if replace:
            text = text.replace('.', '_')
        text = ''.join(
            [s for s in text if s.isalpha() or s.isdigit() or s in accepted_symbols]
        )
        return text

    def _postprocess_date(self, date: str) -> tp.Optional[datetime]:
        """
        Провести постобработку строки даты после процедуры OCR.

        Параметры:
            date: Строка с распознанной датой.

        Возвращает:
            Объект datetime, если дата распозналась правильно, иначе None.
        """
        if not date:
            return None
        if re.match(' +', date):
            return None
        date_array = date.split(' ')
        if date_array[-1] == '':
            date_array = date_array[:-1]
        day = None
        month = None
        year = None
        time = None
        if len(date_array) == 3:
            first, year, time = date_array
            if len(first) > 2:
                day = first[:2].replace('o', '0')
                month = first[2:]
        elif len(date_array) == 4:
            day, month, year, time = date_array
        else:
            return None
        month = self._MONTH_MAPPER.get(month, None)
        if month is None:
            return None
        try:
            hour = int(time[self._HOUR])
            minute = int(time[self._MINUTE])
            second = int(time[self._SECOND])
        except ValueError:
            hour = 0
            minute = 0
            second = 0
        try:
            date = datetime(
                year=int(year),
                month=month,
                day=int(day),
                hour=hour,
                minute=minute,
                second=second
            )
        except ValueError:
            return None
        return date

    def _postprocess_camera_id(self, camera_id: str) -> tp.Optional[str]:
        """
        Провести постобработку строки с ID камеры после процедуры OCR.

        Параметры:
            date: Строка с распознанным ID камеры.

        Возвращает:
            Строку с ID камеры, если она распозналась правильно, иначе None.
        """
        if not camera_id:
            return None
        if re.match(' +', camera_id):
            return None
        try:
            if (
                camera_id.startswith('Apx') or
                camera_id.startswith('apx') or
                camera_id.startswith('a') or
                camera_id[0].isdigit() or
                camera_id[:3] not in ('PVN', 'UVN', 'DVN', 'MMC')

            ):
                offset_index = 0
                for i, symbol in enumerate(camera_id):
                    if symbol.isalpha():
                        continue
                    if symbol == ' ' or symbol == '_':
                        offset_index = i
                        break
                camera_id = camera_id[offset_index+1:]
            while camera_id.find(' ') != -1:
                space_index = camera_id.find(' ')
                if camera_id[space_index - 1] == '_':
                    camera_id = camera_id[:space_index] + camera_id[space_index + 1:]
                elif camera_id[space_index + 1] == '_':
                    camera_id = camera_id[:space_index-1] + camera_id[space_index + 1:]
                else:
                    camera_id = camera_id[:space_index] + '_' + camera_id[space_index + 1:]
        except IndexError:
            return None
        camera_id = camera_id.replace('Q', 'O').replace('G', 'O')
        prefix = camera_id.split('_')[0]
        if prefix == 'PYN':
            camera_id = 'PVN' + camera_id[3:]
        elif prefix == 'UVYN':
            camera_id = 'UVN' + camera_id[4:]
        elif prefix == 'UYN':
            camera_id = 'UVN' + camera_id[3:]
        elif prefix == 'PVYN':
            camera_id = 'PVN' + camera_id[4:]
        try:
            camera_id_parts = camera_id.split('_')
            region = camera_id_parts[2]
            if all(s.isalpha() for s in region) and not region.endswith('O'):
                region = region + 'O'
                region = region.replace('OO', 'O').replace('O0', 'O').replace('0O', 'O').replace('UO', 'O')
                camera_id = '_'.join((*camera_id_parts[:2], region, *camera_id_parts[3:]))
        except IndexError:
            return None
        if camera_id.endswith('_'):
            camera_id = camera_id[:-1]
        return camera_id

    def find_text_indices(
        self,
        text_patch: np.ndarray
    ) -> tp.Tuple[tp.Optional[np.ndarray], tp.Optional[np.ndarray]]:
        tp = np.rot90(text_patch.copy(), k=1)
        t = np.arange(0, tp.shape[1])[((tp == 0).sum(axis=0) != 0)]
        if t.size == 0:
            return None, None
        prev = 0
        cur = 1
        start = 0
        sequences = []
        while prev != t.shape[0]-1:
            if t[cur] - t[prev] > 3:
                index_sequence = t[start: cur]
                sequence_start = index_sequence[0]
                sequence_end = index_sequence[-1]
                sequences.append(np.arange(sequence_start-2, sequence_end+2))
                start = cur
            cur += 1
            prev += 1
        index_sequence = t[start:]
        sequence_start = index_sequence[0]
        sequence_end = index_sequence[-1]
        sequences.append(np.arange(sequence_start-2, tp.shape[1]-1))
        return sequences[0], sequences[-1]