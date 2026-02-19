import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

export interface NavMenu {
    menuID: number;
    title: string;
    pageName: string;
    parentId: number;
    menuOrder: number;
    submenu?: NavMenu[];
}

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiBaseUrl;

    menus = signal<NavMenu[]>([]);

    getMenus() {
        return this.http.get<NavMenu[]>(`${this.apiUrl}/User/GetUserMenus`).subscribe({
            next: (data) => this.menus.set(data),
            error: (err) => console.error('Error fetching menus:', err)
        });
    }
}
