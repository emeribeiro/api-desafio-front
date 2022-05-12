import { Component, OnInit } from '@angular/core';
import { RestapiService } from '../restapi.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../auth/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username:string;
  senha:string;
  error:boolean=false;
  mensagem:string;

  constructor(private service:RestapiService, 
    private router: Router,
    private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
  }

  doLogin() {    
    let response = this.service.login(this.username, this.senha);
    response.subscribe(data => {
      this.tokenStorage.saveToken(data.token);
      this.tokenStorage.saveUsername(data.username);
      this.router.navigate(["/home"]);
      this.error = false;
    },
    err => {
      if (err.status === 0) {
        this.mensagem = "Não foi possível conectar no servidor."
      } else {
        this.mensagem = "Dados incorretos. Verifique o login e senha.";
      }
      this.error = true;
    });
  }
}
