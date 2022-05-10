import { Component, OnInit } from '@angular/core';
import { RestapiService } from '../restapi.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { Router } from '@angular/router';
import { Post } from '../model/Post';
import { Comentario } from '../model/Comentario';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  listar:boolean;
  novo:boolean;
  detalhe:boolean;
  username:string;
  error:boolean;
  sucesso:boolean;
  mensagem:string;

  arquivoCarregado:FileList;
  files: FormData;
  filtro:string;
  posts:Post[] = [];
  form: any = {};
  postSelecionado:Post;
  
  constructor(private service:RestapiService, 
      private tokeService:TokenStorageService,
      private router:Router) { }

  ngOnInit(): void {
    this.username = this.tokeService.getUsername();
    this.listar = true;
    this.novo = false;
    this.detalhe = false;
    this.error = false;
    this.sucesso = false;

    this.carregaPosts();
  }

/*  pesquisarPosts() {
    this.posts = [];
    let response = this.service.getPostsPesquisa(this.filtro);
    response.subscribe(data => {      
      data.forEach(post => {    
        var url = 'data:image/jpeg;base64,' + post.imagem;           
        this.posts.push(new Post(post.id, 
          post.titulo, 
          post.link, 
          post.texto,
          post.dono,
          url,
          null));
      });
    },
    err => {  
      if (err.status == 401) {
        this.router.navigate(["/login"]);
      }    
    });
  }*/

  criarPost() {
    this.listar = false;
    this.novo = true;
    this.detalhe = false;
    this.sucesso = false;
    this.error = false;
  }

  carregaPost(id:string) {
    this.listar = false;
    this.novo = false;
    this.detalhe = true;
    this.sucesso = false;
    this.error = false;
    let response = this.service.getPost(id);
    response.subscribe(data => {                
      const comentarios = [];
      data.comentarios.forEach(comentario => {
        comentarios.push(new Comentario(comentario.texto,
          null, 
          comentario.usuario,
          comentario.id));
      });
      
      var url = 'data:image/jpeg;base64,' + data.imagem;           
      this.postSelecionado = new Post(data.id, 
        data.titulo, 
        data.link, 
        data.texto,
        data.usuario,
        url,
        comentarios);              
    },
    err => {  
      if (err.status == 401) {
        this.router.navigate(["/login"]);
      }    
    });
  }

  salvarPost() {
    let response = this.service.addPost(
      this.form,
      this.files);
    response.subscribe(response => {
      this.sucesso = true;
      this.error = false;
      this.form = {};
      this.arquivoCarregado = null;      
      this.mensagem = 'Post criado com sucesso.';
    },
    err => {
      if (err.status == 401) {
        this.router.navigate(["/login"]);
      } else {
        this.error = true;
        this.sucesso = false;
        this.mensagem = 'Houve um erro na criação do post. Por favor, tente novamente.';
      }

    });
  }

  excluirPost(id:string) {
    let response = this.service.deletePost(id);
    response.subscribe(response => {
      this.sucesso = true;
      this.error = false;
      this.posts= [];
      this.carregaPosts();
      this.mensagem = 'Post excluído com sucesso.';
    },
    err => {
      if (err.status == 401) {
        this.router.navigate(["/login"]);
      } else {
        this.sucesso = false;
        this.error = true;
        this.mensagem = 'Houve um erro na exclusão do post. Por favor, tente novamente.';
      }
    });
  }

  carregaPosts() {
    let response = this.service.getPosts();
    response.subscribe(data => {      
      data.forEach(post => {    
        var url = 'data:image/jpeg;base64,' + post.imagem;           
        this.posts.push(new Post(post.id, 
          post.titulo, 
          post.link, 
          post.texto,
          post.usuario,
          url,
          null));
      });
    },
    err => {  
      if (err.status == 401) {
        this.router.navigate(["/login"]);
      }    
    });
  }

  salvarComentario() {
    const comentario = new Comentario(this.form.comentario, 
      this.postSelecionado.id, null, null);      
    let response = this.service.addComentario(comentario);
    response.subscribe(data => {      
      this.error = false;
      this.sucesso = true;
      this.mensagem = 'Comentário Salvo com sucesso.';      
      this.carregaPost(this.postSelecionado.id);
      this.form = {};
    },
    err => {  
      if (err.status == 401) {
        this.router.navigate(["/login"]);
      }    

      this.error = true;
      this.sucesso = false;
      this.mensagem = 'Houve um erro na criação do comentário. Por favor, tente novamente.';
    });
  }

  excluirComentario(id:string) {    
    let response = this.service.deleteComentario(id);
    response.subscribe(response => {
      this.sucesso = true;
      this.error = false;
      this.posts= [];
      this.carregaPost(this.postSelecionado.id);      
    },
    err => {
      if (err.status == 401) {
        this.router.navigate(["/login"]);
      } else {
        this.sucesso = false;
        this.error = true;
        this.mensagem = 'Houve um erro na exclusão do post. Por favor, tente novamente.';
      }
    });
  }

  inputFileChange(event) {
    if (event.target.files && event.target.files[0]) {      
      this.arquivoCarregado = event.target.files;    
      this.files = new FormData();
      const files = new FormData();
      
      Array.prototype.forEach.call(event.target.files, function(file) { 
        const foto = file;  
        files.append('files', foto);
      });
            
      this.files = files; 
    }
  }

}
