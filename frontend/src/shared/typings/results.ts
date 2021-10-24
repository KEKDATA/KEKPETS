export interface Result {
  id: string;
  image: string;
  /**
   * string -> left,top,width,height
   */
  bbox: string;
  address: string | null;
  /**
   * ISO format
   */
  date: string | null;
}

export type Results = Array<Result> | null;
