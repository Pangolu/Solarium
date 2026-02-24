import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Planta } from '../planta';
import { PlantesTableRow } from '../plantes-table-row/plantes-table-row';
import { Supaservice } from '../../services/supaservice';


@Component({
  selector: 'app-plantes-table',
  imports: [PlantesTableRow, ReactiveFormsModule],
  templateUrl: './plantes-table.html',
  styleUrl: './plantes-table.css',
})
export class PlantesTable {

  private readonly formBuilder = new FormBuilder();
  private readonly supaservice = inject(Supaservice);

  plantes = signal<Planta[]>([]);
  errorMessage = signal<string>('');
  isSaving = signal<boolean>(false);
  editingPlantaId = signal<number | null>(null);

  plantaForm = this.formBuilder.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(3)]],
    latitude: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
    capacitat: [0, [Validators.required, Validators.min(0.1)]],
    foto: [''],
    favorite: [false],
  });

  async ngOnInit() {
    await this.carregarPlantes();
  }

  async afegirPlanta() {
    if (this.plantaForm.invalid) {
      this.plantaForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isSaving.set(true);

    try {
      const formValue = this.plantaForm.getRawValue();
      const payload: Omit<Planta, 'id' | 'user'> = {
        created_at: Math.floor(Date.now() / 1000),
        nom: formValue.nom.trim(),
        ubicacio: {
          latitude: Number(formValue.latitude),
          longitude: Number(formValue.longitude),
        },
        capacitat: Number(formValue.capacitat),
        favorite: formValue.favorite,
        foto: '/imatge_predefinida.png',
      };

      const foto = formValue.foto.trim();
      if (foto) {
        payload.foto = foto;
      }

      const editingId = this.editingPlantaId();
      if (editingId === null) {
        await this.supaservice.insertPlantaForCurrentUser(payload);
      } else {
        await this.supaservice.updatePlantaForCurrentUser(editingId, payload);
      }

      await this.carregarPlantes();

      this.plantaForm.reset({
        nom: '',
        latitude: 0,
        longitude: 0,
        capacitat: 0,
        foto: '',
        favorite: false,
      });
      this.editingPlantaId.set(null);
    } catch (error) {
      const fallback = 'Error al guardar la planta';
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : fallback;
      this.errorMessage.set(message || fallback);
    } finally {
      this.isSaving.set(false);
    }
  }

  editarPlanta(planta: Planta) {
    this.editingPlantaId.set(planta.id);
    this.errorMessage.set('');
    this.plantaForm.setValue({
      nom: planta.nom,
      latitude: planta.ubicacio.latitude,
      longitude: planta.ubicacio.longitude,
      capacitat: planta.capacitat,
      foto: planta.foto ?? '',
      favorite: planta.favorite ?? false,
    });
  }

  async eliminarPlanta(plantaId: number) {
    this.errorMessage.set('');
    try {
      await this.supaservice.deletePlantaForCurrentUser(plantaId);
      await this.carregarPlantes();
      if (this.editingPlantaId() === plantaId) {
        this.editingPlantaId.set(null);
        this.plantaForm.reset({
          nom: '',
          latitude: 0,
          longitude: 0,
          capacitat: 0,
          foto: '',
          favorite: false,
        });
      }
    } catch (error) {
      const fallback = 'Error al eliminar la planta';
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : fallback;
      this.errorMessage.set(message || fallback);
    }
  }

  private async carregarPlantes() {
    this.errorMessage.set('');
    try {
      const plantes = await this.supaservice.getPlantesFromCurrentUser();
      this.plantes.set(plantes);
    } catch (error) {
      this.plantes.set([]);
      const fallback = 'Error al carregar les plantes';
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : fallback;
      this.errorMessage.set(message || fallback);
    }
  }
}
