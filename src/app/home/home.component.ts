import { Component, OnInit } from '@angular/core';
 
import { TokenStorageService } from '../auth/token-storage.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  info: any;
 
  constructor(private token: TokenStorageService, private router:Router) { }
 
  ngOnInit() {
    this.info = {
      token: this.token.getToken(),
      username: this.token.getUsername()
    };
  }
 
  logout() {
    this.token.signOut();
    window.location.reload();
  }

  usuarios() {
    this.router.navigate(["/user"]);
  }

  posts() {
    this.router.navigate(["/posts"]);
  }

  album() {
    this.router.navigate(["/album"]);
  }
}