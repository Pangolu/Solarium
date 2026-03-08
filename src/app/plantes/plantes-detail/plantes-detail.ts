import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Supaservice } from '../../services/supaservice';
import { Planta } from '../planta';

@Component({
  selector: 'app-plantes-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './plantes-detail.html',
  styleUrl: './plantes-detail.css',
})
export class PlantesDetail {
  private supaservice: Supaservice = inject(Supaservice);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private readonly defaultImage = '/imatge_predefinida.png';

  planta = signal<Planta | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  async ngOnInit() {
    await this.loadPlantaDetail();
  }

  getImageSrc() {
    const rawFoto = this.planta()?.foto?.trim();
    if (!rawFoto) {
      return this.defaultImage;
    }

    const sanitizedFoto = rawFoto.replace(/^['"]+|['"]+$/g, '');

    if (/^https?:\/\//i.test(sanitizedFoto)) {
      return sanitizedFoto;
    }

    if (/^www\./i.test(sanitizedFoto)) {
      return `https://${sanitizedFoto}`;
    }

    if (sanitizedFoto.startsWith('/')) {
      return sanitizedFoto;
    }

    return `/${sanitizedFoto}`;
  }

  private async loadPlantaDetail() {
    this.loading.set(true);
    this.errorMessage.set('');

    const idParam = this.route.snapshot.paramMap.get('id');
    const plantaId = Number(idParam);

    if (!idParam || Number.isNaN(plantaId)) {
      this.planta.set(null);
      this.errorMessage.set('ID de planta no valid');
      this.loading.set(false);
      return;
    }

    try {
      const plantes = await this.supaservice.getPlantesFromCurrentUser();
      const selectedPlanta = plantes.find((item) => item.id === plantaId) ?? null;

      if (!selectedPlanta) {
        this.errorMessage.set("No s'ha trobat la planta seleccionada");
      }

      this.planta.set(selectedPlanta);
    } catch (error) {
      const fallback = 'Error en carregar el detall de la planta';
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : fallback;
      this.errorMessage.set(message || fallback);
      this.planta.set(null);
    } finally {
      this.loading.set(false);
    }
  }
}
