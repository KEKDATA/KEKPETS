FROM python:3.9.4

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y gcc python3-dev libpq-dev netcat && apt-get install -y tesseract-ocr libtesseract-dev tesseract-ocr-rus ffmpeg libsm6 libxext6
RUN pip install --upgrade pip
COPY requirements.txt .
#RUN pip install torch
RUN pip install -r requirements.txt --no-cache-dir
RUN pip install gdown
RUN mkdir "ml_models"
RUN wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=1UQGEPO5c5g5uZGB_AYDLlsZRLSSGHzvu' -O ml_models/color.onnx
RUN wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=1sr6PU88cb-lVVqiLZ2_TlsK8Ykr2f0eb' -O ml_models/breed.onnx
RUN wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=1NubqQeUORNPhGa4IJ8j15ToziczI19uz' -O ml_models/tail.onnx
RUN gdown 'https://docs.google.com/uc?export=download&id=16uuOfvfp20jWG3hbaVijC1bURczYgQBk' -O ml_models/yolox_l.onnx
COPY . .
#COPY ./entrypoint.sh .
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

