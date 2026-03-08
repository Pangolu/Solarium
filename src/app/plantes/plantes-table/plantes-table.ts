import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Planta } from '../planta';
import { PlantesTableRow } from '../plantes-table-row/plantes-table-row';
import { Supaservice } from '../../services/supaservice';
import * as L from 'leaflet';

@Component({
  selector: 'app-plantes-table',
  imports: [PlantesTableRow, ReactiveFormsModule],
  templateUrl: './plantes-table.html',
  styleUrl: './plantes-table.css',
})
export class PlantesTable {
  private readonly formBuilder = new FormBuilder();
  private readonly supaservice = inject(Supaservice);
  private mapPicker: L.Map | null = null;
  private selectedMarker: L.Marker | null = null;
  private readonly spainCenter: L.LatLngExpression = [40.4168, -3.7038];

  @ViewChild('mapPickerContainer')
  mapPickerContainer?: ElementRef<HTMLDivElement>;

  plantes = signal<Planta[]>([]);
  errorMessage = signal<string>('');
  isSaving = signal<boolean>(false);
  editingPlantaId = signal<number | null>(null);
  formSubmitted = signal<boolean>(false);

  plantaForm = this.formBuilder.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(8)]],
    latitude: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
    capacitat: [0, [Validators.required, this.greaterThanValidator(100)]],
    foto: [''],
    favorite: [false],
  });

  async ngOnInit() {
    await this.carregarPlantes();
  }

  ngAfterViewInit() {
    this.initializeMapPicker();
  }

  ngOnDestroy() {
    if (this.mapPicker) {
      this.mapPicker.remove();
      this.mapPicker = null;
    }
  }

  async afegirPlanta() {
    this.formSubmitted.set(true);
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
      this.clearMapSelection();
      this.formSubmitted.set(false);
      this.editingPlantaId.set(null);
    } catch (error) {
      const fallback = 'Error en desar la planta';
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
    this.formSubmitted.set(false);
    this.plantaForm.setValue({
      nom: planta.nom,
      latitude: planta.ubicacio.latitude,
      longitude: planta.ubicacio.longitude,
      capacitat: planta.capacitat,
      foto: planta.foto ?? '',
      favorite: planta.favorite ?? false,
    });
    this.setMapSelection(planta.ubicacio.latitude, planta.ubicacio.longitude, true);
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
        this.clearMapSelection();
        this.formSubmitted.set(false);
      }
    } catch (error) {
      const fallback = 'Error en eliminar la planta';
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : fallback;
      this.errorMessage.set(message || fallback);
    }
  }

  isFieldInvalid(fieldName: 'nom' | 'latitude' | 'longitude' | 'capacitat' | 'foto') {
    const control = this.plantaForm.controls[fieldName];
    return control.invalid && (control.touched || this.formSubmitted());
  }

  shouldShowValidationSummary() {
    return this.plantaForm.invalid && (this.plantaForm.touched || this.formSubmitted());
  }

  getValidationMessages() {
    const messages: string[] = [];
    const nomControl = this.plantaForm.controls.nom;
    const latitudeControl = this.plantaForm.controls.latitude;
    const longitudeControl = this.plantaForm.controls.longitude;
    const capacitatControl = this.plantaForm.controls.capacitat;

    if (nomControl.hasError('required')) {
      messages.push('El nom es obligatori.');
    }
    if (nomControl.hasError('minlength')) {
      messages.push('El nom ha de tenir com a minim 8 caracters.');
    }
    if (capacitatControl.hasError('required')) {
      messages.push('La capacitat es obligatoria.');
    }
    if (capacitatControl.hasError('greaterThan')) {
      messages.push('La capacitat ha de ser major que 100.');
    }
    if (latitudeControl.hasError('required')) {
      messages.push('La latitud es obligatoria.');
    }
    if (latitudeControl.hasError('min') || latitudeControl.hasError('max')) {
      messages.push("La latitud ha d'estar entre -90 i 90.");
    }
    if (longitudeControl.hasError('required')) {
      messages.push('La longitud es obligatoria.');
    }
    if (longitudeControl.hasError('min') || longitudeControl.hasError('max')) {
      messages.push("La longitud ha d'estar entre -180 i 180.");
    }

    return messages;
  }

  private greaterThanValidator(minExclusive: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const rawValue = control.value;
      if (rawValue === null || rawValue === undefined || rawValue === '') {
        return null;
      }

      const numericValue = Number(rawValue);
      if (!Number.isFinite(numericValue)) {
        return { greaterThan: { minExclusive } };
      }

      return numericValue > minExclusive ? null : { greaterThan: { minExclusive } };
    };
  }

  private initializeMapPicker() {
    const container = this.mapPickerContainer?.nativeElement;
    if (!container || this.mapPicker) {
      return;
    }

    this.mapPicker = L.map(container, {
      center: this.spainCenter,
      zoom: 5,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.mapPicker);

    this.mapPicker.on('click', (event: L.LeafletMouseEvent) => {
      this.setMapSelection(event.latlng.lat, event.latlng.lng, false);
    });

    setTimeout(() => {
      this.mapPicker?.invalidateSize();
    }, 0);
  }

  private setMapSelection(latitude: number, longitude: number, centerMap: boolean) {
    const lat = Number(latitude.toFixed(6));
    const lng = Number(longitude.toFixed(6));

    this.plantaForm.patchValue({ latitude: lat, longitude: lng });
    this.plantaForm.controls.latitude.markAsTouched();
    this.plantaForm.controls.longitude.markAsTouched();

    if (!this.mapPicker) {
      return;
    }

    const markerPoint: L.LatLngExpression = [lat, lng];
    if (this.selectedMarker) {
      this.selectedMarker.setLatLng(markerPoint);
    } else {
      this.selectedMarker = L.marker(markerPoint).addTo(this.mapPicker);
    }

    if (centerMap) {
      this.mapPicker.setView(markerPoint, 8);
    }
  }

  private clearMapSelection() {
    if (this.selectedMarker && this.mapPicker) {
      this.mapPicker.removeLayer(this.selectedMarker);
    }
    this.selectedMarker = null;
    this.mapPicker?.setView(this.spainCenter, 5);
  }

  private async carregarPlantes() {
    this.errorMessage.set('');
    try {
      const plantes = await this.supaservice.getPlantesFromCurrentUser();
      this.plantes.set(plantes);
    } catch (error) {
      this.plantes.set([]);
      const fallback = 'Error en carregar les plantes';
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
