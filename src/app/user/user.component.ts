import { Component, OnInit } from '@angular/core';
import { RestapiService } from '../restapi.service';
import { User } from '../model/User';
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  form: any = {};
  
  listar:boolean=false;
  novo:boolean=false;

  error:boolean=false;
  sucesso:boolean=false;
  mensagem:string;

  usuarios=[];

  private user: User;  

  constructor(private service:RestapiService, private router:Router) { }

  ngOnInit(): void {
    this.listar = true;
    this.novo = false;

    let response = this.service.getUsers();
    response.subscribe(data => {
      data.forEach(user => {
        this.usuarios.push(new User(user.nome, 
          user.username, 
          null))});      
    },
    err => {    
      if (err.status == 401) {
        this.router.navigate(["/login"]);
      }  
    });
  }

  newUser() {
    this.novo = true;
    this.listar = false;
  }

  addUser() {
    this.user = new User(
      this.form.nome,
      this.form.username, 
      this.form.senha);

    let response = this.service.addUser(this.user);
    response.subscribe(retorno => {      
      this.error = false;  
      this.sucesso = true;
      this.form = {};
    },
    err => {
      this.sucesso = false;      
      if (err.status == '400') {
        this.mensagem = err.error;
      } else if (err.status == 401) {
        this.router.navigate(["/login"]);
      }  
      else {
        this.error = true;
      }
    });
  }
}
