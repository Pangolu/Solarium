import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Supaservice } from '../../services/supaservice';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  supaservice: Supaservice = inject(Supaservice);
  formulario: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  errorMessage: string = '';

  constructor(){
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  get emailNotValid(){
    return this.formulario.controls['email']!.invalid && this.formulario.controls['email']!.touched;
  }

  async login(){
    if (this.formulario.valid) {
      try {
        await this.supaservice.login(this.formulario.value);
        this.errorMessage = '';
        // Navigate to home after successful login
        this.router.navigate(['/home']);
      } catch (error: any) {
        this.errorMessage = error.message || 'Login failed';
      }
    } else {
      this.errorMessage = 'Please fill in all fields correctly';
      this.formulario.markAllAsTouched();
    }
  }
}
