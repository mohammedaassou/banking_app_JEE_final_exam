import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
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

}
