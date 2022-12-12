import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  errorMessage: String = '';
  form: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPass: ['', Validators.required],
      bio: ['', Validators.required],
    });
  }
  submitForm() {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    console.log(this.form.value);
    this.http
      .post('http://localhost:4000/user/register', this.form.value, {
        headers: headers,
      })
      .subscribe(
        // The response data
        (response) => {
          console.log(response);
        },

        // If there is an error
        (error) => {
          console.log(error);
          this.errorMessage = 'User Already Exists';
        },

        // When observable completes
        () => {
          console.log('done!');
          this.router.navigate(['login']);
        }
      );
  }
}
