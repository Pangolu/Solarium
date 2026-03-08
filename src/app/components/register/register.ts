import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  email,
  form,
  minLength,
  pattern,
  required,
  submit,
  validateTree,
} from '@angular/forms/signals';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Supaservice } from '../../services/supaservice';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  private supaservei: Supaservice = inject(Supaservice);
  private enrutador: Router = inject(Router);

  modelRegistre = signal({
    nomComplet: '',
    correuElectronic: '',
    contrasenya: '',
    confirmaContrasenya: '',
  });

  formulariRegistre = form(this.modelRegistre, (camp) => {
    required(camp.correuElectronic);
    email(camp.correuElectronic);
    pattern(camp.correuElectronic, this.emailRegex);
    required(camp.contrasenya);
    minLength(camp.contrasenya, 8);
    required(camp.confirmaContrasenya);
    minLength(camp.confirmaContrasenya, 8);
    validateTree(camp, ({ value }) => {
      const model = value();
      if (!model.contrasenya || !model.confirmaContrasenya) {
        return undefined;
      }

      return model.contrasenya === model.confirmaContrasenya
        ? undefined
        : {
            kind: 'contrasenyes-no-coincideixen',
            message: 'Les contrasenyes no coincideixen.',
          };
    });
  });

  missatgeError = signal('');
  isSubmitting = signal(false);

  nomCompletMassaCurt = computed(() => {
    const camp = this.formulariRegistre.nomComplet();
    const valor = this.modelRegistre().nomComplet.trim();
    return camp.touched() && valor.length > 0 && valor.length < 2;
  });

  correuObligatori = computed(() => {
    const camp = this.formulariRegistre.correuElectronic();
    return camp.touched() && !this.modelRegistre().correuElectronic.trim();
  });

  correuFormatInvalid = computed(() => {
    const camp = this.formulariRegistre.correuElectronic();
    const valor = this.modelRegistre().correuElectronic.trim();
    return camp.touched() && valor.length > 0 && !this.emailRegex.test(valor);
  });

  contrasenyaNoValida = computed(() => {
    const camp = this.formulariRegistre.contrasenya();
    const valor = this.modelRegistre().contrasenya;
    return camp.touched() && valor.length > 0 && valor.length < 8;
  });

  confirmaContrasenyaNoValida = computed(() => {
    const camp = this.formulariRegistre.confirmaContrasenya();
    const valor = this.modelRegistre().confirmaContrasenya;
    return camp.touched() && valor.length > 0 && valor.length < 8;
  });

  contrasenyesNoCoincideixen = computed(() => {
    const campConfirmacio = this.formulariRegistre.confirmaContrasenya();
    if (!campConfirmacio.touched()) {
      return false;
    }

    return this.formulariRegistre()
      .errors()
      .some((error) => error.kind === 'contrasenyes-no-coincideixen');
  });

  actualitzarCamp(
    camp: 'nomComplet' | 'correuElectronic' | 'contrasenya' | 'confirmaContrasenya',
    event: Event,
  ) {
    const valor = (event.target as HTMLInputElement).value;
    this.formulariRegistre[camp]().value.set(valor);
  }

  marcarComTocat(camp: 'nomComplet' | 'correuElectronic' | 'contrasenya' | 'confirmaContrasenya') {
    this.formulariRegistre[camp]().markAsTouched();
  }

  async registrar() {
    this.missatgeError.set('');
    this.isSubmitting.set(true);

    try {
      await submit(this.formulariRegistre, async () => {
        const valor = this.modelRegistre();
        await this.supaservei.signup({
          email: valor.correuElectronic.trim(),
          password: valor.contrasenya,
          fullName: valor.nomComplet.trim() || undefined,
        });

        this.modelRegistre.set({
          nomComplet: '',
          correuElectronic: '',
          contrasenya: '',
          confirmaContrasenya: '',
        });
        this.formulariRegistre().reset(this.modelRegistre());
        this.enrutador.navigate(['/home']);
        return undefined;
      });

      if (this.formulariRegistre().invalid() && !this.missatgeError()) {
        this.missatgeError.set('Omple tots els camps correctament');
      }
    } catch (error: unknown) {
      this.missatgeError.set(error instanceof Error ? error.message : 'Ha fallat el registre');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
