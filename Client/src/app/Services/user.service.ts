import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7009/api/User'
  constructor() { }

  http = inject(HttpClient)

  getAllUsers() {
    return this.http.get<User[]>(this.apiUrl);
  }

  addUser(data: any) {
    return this.http.post(this.apiUrl, data);
  }
  updateUser(user: User) {
    return this.http.put(`${this.apiUrl}/${user.id}`, user)
  }
  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
