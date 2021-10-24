# KEKPETS_ML
Нужно:

1. Установить tesseract 

    ```
    sudo apt install tesseract-ocr
    sudo apt install libtesseract-dev
    ```

1. Скачать файлы моделей по [ссылке](https://drive.google.com/drive/folders/1ASVkXmL9oD6N_Fl4w7G8AeNBx-1-z8sf?usp=sharing); 
2. Поменять в `config.yml` пути до этих файлов;
3. Вытащить файл `example.py` из корня на уровень выше и можно запускать его, по идее. В этом файле пример, как юзать модель.