export interface NewsListResponse {
  ok: boolean;
  noticias: Noticia[];
}

export interface Noticia {
  publicada: boolean;
  fotos: string[];
  _id: string;
  link: string;
  titulo: string;
  subtitulo: string;
  contenidoCrudo: string;
  categoria: string;
  contenidoTerminado: string;
  fechaCreacion: Date;
}
