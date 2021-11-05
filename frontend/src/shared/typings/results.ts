export interface Result {
  id: string;
  /**
   * Фото на основе которого производился анализ
   */
  image: string;
  /**
   * string -> left,top,width,height
   * Координаты для построения фигуры, которая служит для показа животного на фото
   */
  bbox: string;
  /**
   * Адрес камеры, где был обнаружен предполагаемый питомец
   */
  address: string | null;
  /**
   * ISO format
   * Дата пропажи животного
   */
  date: string | null;
  /**
   * Массив телефонов ближайшего отделения, например, Array<'+74992590075', '+74992567575'>
   * Если не нашли телефоны - пустой массив
   */
  ovd_phones: Array<string>;
}

export type Results = Array<Result> | null;
