import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginDTO } from '../../dtos/user/login.dto';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../responses/user/login.response';
import { UserResponse } from '../../responses/user/user.response';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role';
import { BaseComponent } from '../base/base.component';
import { ApiResponse } from 'src/app/responses/api.response';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string = '11111111';
  password: string = '11111';
  showPassword: boolean = false;
  
  roles: Role[] = [];
  rememberMe: boolean = true;
  selectedRole: Role | undefined;
  userResponse?: UserResponse;

  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles
    debugger
    this.roleService.getRoles().subscribe({
      next: ({ data: roles }: ApiResponse) => {
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      error: (error: any) => {
        debugger
        console.error('Error getting roles:', error);
      }
    });
  }

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);

    // validate phone must be at least 6 characters
  }

  login() {
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };
  
    this.userService.login(loginDTO).pipe(
      tap((apiResponse: ApiResponse) => {
        const { token } = apiResponse.data;
        this.tokenService.setToken(token);
      }),
      switchMap((apiResponse: ApiResponse) => {
        const { token } = apiResponse.data;
        return this.userService.getUserDetail(token).pipe(
          tap((apiResponse2: ApiResponse) => {
            this.userResponse = {
              ...apiResponse2.data,
              date_of_birth: new Date(apiResponse2.data.date_of_birth),
            };
  
            if (this.rememberMe) {
              this.userService.saveUserToLocalStorage(this.userResponse);
            }
  
            if (this.userResponse?.role.name === 'admin') {
              this.router.navigate(['/admin']);
            } else if (this.userResponse?.role.name === 'user') {
              this.router.navigate(['/']);
            }
          }),
          catchError((error: HttpErrorResponse) => {
            console.error('Lỗi khi lấy thông tin người dùng:', error?.error?.message ?? '');
            return of(null); // Tiếp tục chuỗi Observable
          })
        );
      }),
      finalize(() => {
        this.cartService.refreshCart();
      })
    ).subscribe({
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Sai thông tin đăng nhập',
          title: 'Lỗi Đăng Nhập'
        });
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  createAccount() {
    // Chuyển hướng người dùng đến trang đăng ký
    this.router.navigate(['/register']); 
  }
}
