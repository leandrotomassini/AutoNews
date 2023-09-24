export interface NewsListResponse {
  ok: boolean;
  total: number;
  newsData: NewsDatum[];
}

export interface NewsDatum {
  h1: string;
  h2: string;
  combinedText: string;
  images: string[];
}
