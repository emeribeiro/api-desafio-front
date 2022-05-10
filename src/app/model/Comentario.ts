export class Comentario {
    id:string;
    texto:string;
    idPost:string;
    usuario:string;

    constructor(texto:string, idPost:string, usuario:string, id:string) {
        this.texto = texto;
        this.idPost = idPost;
        this.usuario = usuario;
        this.id = id;
    }
}