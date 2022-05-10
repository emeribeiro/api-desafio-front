import { Component } from '@angular/core';
import { TokenStorageService } from './auth/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'desafio_tecnico-front';
  logged: boolean = false;

  constructor(private tokenStorage: TokenStorageService,
    private router:Router) { }
 
  ngOnInit() {
    if (!this.tokenStorage.getToken()) {
      this.router.navigate(["/login"]);
      this.logged = false;
    } else {
      this.router.navigate(["/home"]);
      this.logged = true;
    }
  }
}
