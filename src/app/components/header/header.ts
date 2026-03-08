import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Supaservice } from '../../services/supaservice';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  supaservice: Supaservice = inject(Supaservice);
  router: Router = inject(Router);

  async logout() {
    await this.supaservice.logout();
    this.router.navigate(['/home']);
  }
}
