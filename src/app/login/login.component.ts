import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginDTO } from '../dtos/user/login.dto';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string = '11111111';
  password: string = '11111';

  constructor(private router: Router, private userService: UserService) {
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
    const loginDTO:LoginDTO = {
      "phone_number": this.phoneNumber,
      "password": this.password
    }

    this.userService.login(loginDTO).subscribe({
        next: (response: any) => {
          debugger
          this.router.navigate(['/login']);
        },
        complete: () => {
          debugger
        },
        error: (error: any) => {
          alert(`Cannot login, error: ${error.error}`);
        }
      }
    );
  }
}
