import { Inject, inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { environment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';
import { UserResponse } from '../responses/user/user.response';
import { UpdateUserDTO } from '../dtos/user/update.user.dto';
import { ApiResponse } from '../responses/api.response';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  private apiUserDetail = `${environment.apiBaseUrl}/users/details`;

  private http = inject(HttpClient);
  private httpUtilService = inject(HttpUtilService);  

  localStorage?: Storage;

  constructor(        
    @Inject(DOCUMENT) private document: Document
  ) { 
    this.localStorage = document.defaultView?.localStorage;
  }

  private apiConfig = {
    headers: this.httpUtilService.createHeaders()
  }

  register(registerDTO: RegisterDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiRegister, registerDTO, this.apiConfig);
  }

  login(loginDTO: LoginDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiLogin, loginDTO, this.apiConfig);
  }

  getUserDetail(token: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUserDetail, null, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    });
  }

  updateUserDetail(token: string, updateUserDTO: UpdateUserDTO): Observable<ApiResponse>  {
    let userResponse = this.getUserResponseFromLocalStorage();        
    return this.http.put<ApiResponse>(`${this.apiUserDetail}/${userResponse?.id}`,updateUserDTO,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }

  saveUserToLocalStorage(userResponse?: UserResponse) {
    try {
      if (userResponse == null || !userResponse) {
        return;
      }
      const userResponseJSON = JSON.stringify(userResponse);
      this.localStorage?.setItem('user', userResponseJSON);
      console.log('User response saved to local storage.');
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    } 
  }

  getUserResponseFromLocalStorage(): UserResponse | null {
    try {
      const userResponseJSON = this.localStorage?.getItem('user');
      if (userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }

      const userResponse = JSON.parse(userResponseJSON!);
      console.log('User response retrieved from local storage.');
      return userResponse;
    } catch (error) {
      console.error('Error retrieving user response from local storage:', error);
      return null;
    }
  }

  removeUserFromLocalStorage():void {
    try {
      // Remove the user data from local storage using the key
      this.localStorage?.removeItem('user');
      console.log('User data removed from local storage.');
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
      // Handle the error as needed
    }
  }
}
