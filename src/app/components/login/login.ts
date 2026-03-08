import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { email, form, required, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Supaservice } from '../../services/supaservice';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private supaservei: Supaservice = inject(Supaservice);
  private enrutador: Router = inject(Router);

  modelIniciSessio = signal({
    correuElectronic: '',
    contrasenya: '',
  });

  formulariIniciSessio = form(this.modelIniciSessio, (camp) => {
    required(camp.correuElectronic);
    email(camp.correuElectronic);
    required(camp.contrasenya);
  });

  missatgeError = signal('');
  isSubmitting = signal(false);

  correuNoValid = computed(() => {
    const camp = this.formulariIniciSessio.correuElectronic();
    return camp.touched() && camp.invalid();
  });

  contrasenyaNoValida = computed(() => {
    const camp = this.formulariIniciSessio.contrasenya();
    return camp.touched() && !this.modelIniciSessio().contrasenya.trim();
  });

  actualitzarCorreuElectronic(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.formulariIniciSessio.correuElectronic().value.set(valor);
  }

  actualitzarContrasenya(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.formulariIniciSessio.contrasenya().value.set(valor);
  }

  marcarComTocat(camp: 'correuElectronic' | 'contrasenya') {
    this.formulariIniciSessio[camp]().markAsTouched();
  }

  async iniciarSessio() {
    this.missatgeError.set('');
    this.isSubmitting.set(true);
    try {
      await submit(this.formulariIniciSessio, async () => {
        const valor = this.modelIniciSessio();
        await this.supaservei.login({
          email: valor.correuElectronic.trim(),
          password: valor.contrasenya,
        });
        this.enrutador.navigate(['/plantes_table']);
        return undefined;
      });
      if (this.formulariIniciSessio().invalid() && !this.missatgeError()) {
        this.missatgeError.set('Omple tots els camps correctament');
      }
    } catch (error: unknown) {
      this.missatgeError.set(
        error instanceof Error ? error.message : "Ha fallat l'inici de sessio",
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
