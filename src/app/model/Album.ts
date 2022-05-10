export class Album {
    id:string;
    titulo:string;
    imagens:FormData;
    usuario:string;

    constructor(id, titulo, imagens, usuario) {
        this.id = id;
        this.titulo = titulo; 
        this.imagens = imagens;
        this.usuario = usuario;
    }
}