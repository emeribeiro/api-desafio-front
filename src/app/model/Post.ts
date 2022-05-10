export class Post {
    id:string;
    titulo:string;
    link:string;
    texto:string;    
    usuario:string;
    imagem:any;

    comentarios:any;

    constructor(id:string, titulo:string, link:string, texto:string, 
        usuario:string, imagem:any, comentarios:any) {
        
            this.id = id;
        this.titulo = titulo; 
        this.link = link;
        this.usuario = usuario;
        this.texto = texto;
        this.imagem = imagem;
        this.comentarios = comentarios;
    }
}