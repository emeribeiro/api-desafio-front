import { Component, OnInit } from '@angular/core';
import { Album } from '../model/Album';
import { RestapiService } from '../restapi.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { compileComponentFromMetadata } from '@angular/compiler';
import { TokenStorageService } from '../auth/token-storage.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  username:string;

  listar:boolean;
  novo:boolean;
  detalhe:boolean;
  error:boolean;
  sucesso:boolean;

  arquivosCarregados:FileList;

  files: FormData;
  form: any = {};
  
  albums=[];
  fotos=[];

  constructor(private service:RestapiService, 
    private router:Router,
    private tokenStorageService:TokenStorageService) { }

  ngOnInit(): void {
    this.username = this.tokenStorageService.getUsername();
    this.listar = true;
    this.novo = false;
    this.detalhe = false;    
    this.sucesso = false;
    this.error = false;
    this.carregaAlbums();
    
  }

  novoAlbum() {
    this.novo = true;
    this.listar = false;
    this.detalhe = false;
    this.sucesso = false;
    this.error = false;
  }

  salvarNovoAlbum() {    
    let response = this.service.addAlbum(
      this.form,
      this.files);
    response.subscribe(response => {
      this.sucesso = true;
      this.error = false;
      this.form = {};
      this.arquivosCarregados = null;
      this.carregaAlbums();
    },
    err => {
      if (err.status == 401) {
        this.router.navigate(["/login"]);
      } else {
        this.error = true;
        this.sucesso = false;
      }

    });
  }

  inputFileChange(event) {
    if (event.target.files && event.target.files[0]) {      
      this.arquivosCarregados = event.target.files;    
      this.files = new FormData();
      const files = new FormData();
      
      Array.prototype.forEach.call(event.target.files, function(file) { 
        const foto = file;  
        files.append('arquivos', foto);
      });
            
      this.files = files; 
    }
  }

  abrirAlbum(id:string) {
    this.novo = false;
    this.listar = false;
    this.detalhe = true;
    this.sucesso = false;
    this.error = false;

    let response = this.service.getAlbum(id);
    response.subscribe(response => {
     /* this.nomeAlbum = response.nome;*/
     this.form.titulo = response.titulo;

      response.fotos.forEach(foto => {
        var url = 'data:image/jpeg;base64,' + foto.arquivo;
        this.fotos.push(url);
      });
      
      
    },
    err => {
      if (err.status == 401) {
        this.router.navigate(["/login"]);
      } else {
        this.sucesso = false;
        this.error = true;
      }
    });
  }

  excluirAlbum(id:string) {
    let response = this.service.deleteAlbum(id);
    response.subscribe(response => {
      this.sucesso = true;
      this.error = false;
      this.albums=[];
      this.carregaAlbums();
    },
    err => {
      if (err.status == 401) {
        this.router.navigate(["/login"]);
      } else {
        this.sucesso = false;
        this.error = true;
      }
    });
  }

  carregaAlbums() {
    let response = this.service.getAlbums();
    response.subscribe(data => {
      data.forEach(album => {
        this.albums.push(new Album(album.id, 
          album.titulo, 
          null, 
          album.usuario))});
    },
    err => {  
      if (err.status == 401) {
        this.router.navigate(["/login"]);
      }    
    });
  }
}
