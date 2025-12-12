import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RegisterDTO } from '../../dtos/user/register.dto';
import { BaseComponent } from '../base/base.component';
import { ApiResponse } from 'src/app/responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  // Khai báo các biến tương ứng với các trường dữ liệu trong form
  phoneNumber: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address: string; 
  isAccepted: boolean;
  dateOfBirth: Date;
  showPassword: boolean = false;

  constructor() {
    super();
    this.phoneNumber = '';
    this.password = '';
    this.retypePassword = '';
    this.fullName = '';
    this.address = '';
    this.isAccepted = true;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }

  register() {
    const message = `phone: ${this.phoneNumber}` + 
                    `password: ${this.password}` +
                    `retypePassword: ${this.retypePassword}` +
                    `address: ${this.address}` + 
                    `fullName: ${this.fullName}` +
                    `isAccepted: ${this.isAccepted}` +
                    `dateOfBirth: ${this.dateOfBirth}`;

    debugger
    const registerDTO: RegisterDTO = {
      "fullname": this.fullName,
      "phone_number": this.phoneNumber,
      "address": this.address,
      "password": this.password,
      "retype_password": this.retypePassword,
      "date_of_birth": this.dateOfBirth,
      "facebook_account_id": 0,
      "google_account_id": 0,
      "role_id": 2
    }

    this.userService.register(registerDTO).subscribe({
        next: (apiResponse: ApiResponse) => {
          debugger
          const confirmation = window
            .confirm('Đăng ký thành công, mời bạn đăng nhập. Bấm "OK" để chuyển đến trang đăng nhập.');
          this.router.navigate(['/login']);
        },
        complete: () => {
          debugger
        },
        error: (error: HttpErrorResponse) => {
          debugger;
          this.toastService.showToast({
            error: error,
            defaultMsg: 'Lỗi không xác định',
            title: 'Lỗi Đăng Ký'
          });
        }
      }
    );
  }

  // check password match
  checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword'].setErrors({ 'passwordMismatch': true })
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }

  checkAge() {
    if (this.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({ 'invalidAge': true })
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
