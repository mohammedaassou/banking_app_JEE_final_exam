import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../model/auth.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  isAuthenticated = false;

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  onSearch(event: Event, query: string) {
    event.preventDefault();
    const q = (query || '').trim();
    if (q) {
      this.router.navigate(['/customers'], { queryParams: { q } });
    } else {
      this.router.navigate(['/customers']);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
