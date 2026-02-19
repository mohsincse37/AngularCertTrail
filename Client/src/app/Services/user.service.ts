import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../Models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/User`;

  getUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/GetUsers`);
  }

  getUser(id: number) {
    return this.http.get<User>(`${this.apiUrl}/GetUser/${id}`);
  }

  addUser(userData: any) {
    return this.http.post(`${this.apiUrl}/AddUser`, userData);
  }

  updateUser(id: number, userData: any) {
    return this.http.put(`${this.apiUrl}/UpdateUser/${id}`, userData);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/DeleteUser/${id}`);
  }

  changePassword(data: any) {
    return this.http.put(`${this.apiUrl}/ChangePassword/${data.id || 0}`, data);
  }

  getSubscriptionReport(topicId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/GetUserWiseSubscriptionList/${topicId}`);
  }
}
