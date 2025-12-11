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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string = '11111111';
  password: string = '11111';
  
  roles: Role[] = [];
  rememberMe: boolean = true;
  selectedRole: Role | undefined;
  userResponse?: UserResponse;

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles
    debugger
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {
        debugger
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
    const message = `phone: ${this.phoneNumber}` + 
                    `password: ${this.password}`;

    // alert(message);
    debugger
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };

    this.userService.login(loginDTO).subscribe({
        next: (response: LoginResponse) => {
          debugger
          const {token} = response;
          if (this.rememberMe) {
            this.tokenService.setToken(token);
            this.userService.getUserDetail(token).subscribe({
              next: (response: any) => {
                debugger
                this.userResponse = {
                  ...response,
                  date_of_birth: new Date(response.date_of_birth)
                };
                this.userService.saveUserToLocalStorage(this.userResponse);
                if (this.userResponse?.role.name == 'admin') {
                  this.router.navigate(['admin']);
                } else if (this.userResponse?.role.name == 'user') {
                  this.router.navigate(['/']);
                }
              },
              complete: () => {
                debugger
              },
              error: (error: any) => {
                debugger
                alert(error.error.message);
              }
            })
          }
        },
        complete: () => {
          debugger
        },
        error: (error: any) => {
          debugger
          alert(error?.error?.message);
        }
      }
    );
  }
}
