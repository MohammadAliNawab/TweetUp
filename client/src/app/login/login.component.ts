import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  errorMessage: String = '';
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submitForm() {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    this.http
      .post('http://localhost:4000/user/login', this.form.value, {
        headers: headers,
      })
      .subscribe(
        // The response data
        (response) => {
          // If the user authenticates successfully, we need to store the JWT returned in localStorage
          this.authService.setLocalStorage(response);
        },

        // If there is an error
        (error) => {
          this.errorMessage = 'Incorrect Username or Password';
          console.log(error);
        },

        // When observable completes
        () => {
          console.log('done!', this.form.value);
          this.router.navigate(['feed']);
        }
      );
  }
}
