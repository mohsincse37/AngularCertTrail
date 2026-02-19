import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './Services/auth.service';
import { MenuService } from './Services/menu.service';
import { CartService } from './Services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  public authService = inject(AuthService);
  public menuService = inject(MenuService);
  public cartService = inject(CartService);

  ngOnInit() {
    this.menuService.getMenus();
  }

  logout() {
    this.authService.logout();
  }
}
