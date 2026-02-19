import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Supaservice } from '../../services/supaservice';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  supaservice: Supaservice = inject(Supaservice);
  formulario: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  errorMessage: string = '';
  successMessage: string = '';

  constructor() {
    this.formulario = this.formBuilder.group(
      {
        fullName: [''],
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      },
      { validators: this.passwordsMatchValidator },
    );
  }

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.controls['password']?.value;
    const confirmPassword = group.controls['confirmPassword']?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get emailNotValid() {
    return this.formulario.controls['email']!.invalid && this.formulario.controls['email']!.touched;
  }

  get passwordNotValid() {
    return (
      this.formulario.controls['password']!.invalid && this.formulario.controls['password']!.touched
    );
  }

  get confirmPasswordNotValid() {
    return (
      this.formulario.controls['confirmPassword']!.invalid &&
      this.formulario.controls['confirmPassword']!.touched
    );
  }

  get passwordMismatch() {
    return (
      this.formulario.hasError('passwordMismatch') &&
      this.formulario.controls['confirmPassword']!.touched
    );
  }

  async signup() {
    if (this.formulario.valid) {
      try {
        const { email, password, fullName } = this.formulario.value;
        await this.supaservice.signup({ email, password, fullName });
        this.errorMessage = '';
        this.successMessage = 'Account created. Check your email to confirm.';
        this.formulario.reset();
        this.router.navigate(['/home']);
      } catch (error: any) {
        this.errorMessage = error.message || 'Signup failed';
        this.successMessage = '';
      }
    } else {
      this.errorMessage = 'Please fill in all fields correctly';
      this.successMessage = '';
      this.formulario.markAllAsTouched();
    }
  }
}
