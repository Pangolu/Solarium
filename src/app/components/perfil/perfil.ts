import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Supaservice } from '../../services/supaservice';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  private supaservice: Supaservice = inject(Supaservice);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private readonly defaultAvatar = '/imatge_predefinida.png';

  formulario: FormGroup;
  loading = signal(true);
  avatarPreview = signal(this.defaultAvatar);
  errorMessage = '';
  successMessage = '';

  private initialFullName = '';
  private initialAvatar = '';
  private currentAvatar = '';

  constructor() {
    this.formulario = this.formBuilder.group(
      {
        fullName: [''],
        email: [{ value: '', disabled: true }],
        password: ['', [Validators.minLength(8)]],
        confirmPassword: [''],
      },
      { validators: this.passwordsMatchValidator },
    );
  }

  async ngOnInit() {
    await this.loadProfile();
  }

  get passwordNotValid() {
    const control = this.formulario.controls['password'];
    return !!control && control.touched && control.hasError('minlength');
  }

  get passwordMismatch() {
    return (
      this.formulario.hasError('passwordMismatch') &&
      this.formulario.controls['confirmPassword']!.touched
    );
  }

  markAsTouched(fieldName: 'password' | 'confirmPassword') {
    this.formulario.controls[fieldName]?.markAsTouched();
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Selecciona una imatge valida';
      this.successMessage = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        this.errorMessage = "No s'ha pogut llegir la imatge seleccionada";
        this.successMessage = '';
        return;
      }

      this.currentAvatar = result;
      this.avatarPreview.set(result);
      this.errorMessage = '';
    };
    reader.readAsDataURL(file);
  }

  async saveProfile() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.errorMessage = 'Revisa els camps del formulari';
      return;
    }

    const rawFullName = String(this.formulario.controls['fullName']?.value ?? '').trim();
    const rawPassword = String(this.formulario.controls['password']?.value ?? '').trim();

    const changes: { fullName?: string; password?: string; avatarUrl?: string } = {};

    if (rawFullName !== this.initialFullName) {
      changes.fullName = rawFullName;
    }
    if (rawPassword) {
      changes.password = rawPassword;
    }
    if (this.currentAvatar !== this.initialAvatar) {
      changes.avatarUrl = this.currentAvatar;
    }

    if (Object.keys(changes).length === 0) {
      this.errorMessage = 'No hi ha canvis per desar';
      return;
    }

    try {
      await this.supaservice.updateCurrentUserProfile(changes);
      this.successMessage = 'Perfil actualitzat correctament';

      this.initialFullName = rawFullName;
      this.initialAvatar = this.currentAvatar;
      this.formulario.patchValue({ password: '', confirmPassword: '' });
      this.formulario.markAsPristine();
    } catch (error: unknown) {
      this.errorMessage =
        error instanceof Error ? error.message : "No s'ha pogut actualitzar el perfil";
    }
  }

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.controls['password']?.value;
    const confirmPassword = group.controls['confirmPassword']?.value;

    if (!password && !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private async loadProfile() {
    this.loading.set(true);
    this.errorMessage = '';

    try {
      const profile = await this.supaservice.getCurrentUserProfile();
      this.initialFullName = profile.fullName;
      this.initialAvatar = profile.avatarUrlRaw;
      this.currentAvatar = profile.avatarUrlRaw;
      this.avatarPreview.set(profile.avatarUrl);

      this.formulario.patchValue({
        fullName: profile.fullName,
        email: profile.email,
      });
    } catch (error: unknown) {
      this.errorMessage =
        error instanceof Error ? error.message : "No s'ha pogut carregar el perfil";
    } finally {
      this.loading.set(false);
    }
  }
}
