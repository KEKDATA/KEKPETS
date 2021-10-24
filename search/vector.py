from django.conf import settings


class VectorBuilder:
    colors = settings.ML_CONFIG.color_model.classes
    breeds = settings.ML_CONFIG.breed_model.classes
    length = len(colors) + len(breeds) + 1

    @classmethod
    def build(cls, colors: dict[str, float], breeds: dict[str, float], long_tail_proba: float) -> list[float]:
        color_path = [colors.get(color, 0) for color in cls.colors]
        breeds_path = [breeds.get(breed, 0) for breed in cls.breeds]
        tail_path = [long_tail_proba]
        vector = color_path + breeds_path + tail_path
        assert len(vector) == cls.length
        return list(map(float, vector))
