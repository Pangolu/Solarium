import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import * as L from 'leaflet';
import { Supaservice } from '../../services/supaservice';
import { Planta } from '../../plantes/planta';

@Component({
  selector: 'app-mapa',
  imports: [],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa implements AfterViewInit, OnDestroy {
  private supaservice: Supaservice = inject(Supaservice);
  private map: L.Map | null = null;
  private markersLayer = L.layerGroup();

  @ViewChild('mapContainer', { static: true })
  private mapContainer?: ElementRef<HTMLDivElement>;

  loading = signal(true);
  errorMessage = signal('');

  async ngAfterViewInit() {
    this.initializeMap();
    await this.loadPlantMarkers();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initializeMap() {
    const container = this.mapContainer?.nativeElement;
    if (!container) {
      this.errorMessage.set("No s'ha pogut inicialitzar el contenidor del mapa");
      return;
    }

    this.map = L.map(container, {
      center: [39.47, -0.38],
      zoom: 6,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
  }

  private async loadPlantMarkers() {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const plantes = await this.supaservice.getPlantesFromCurrentUser();
      this.renderMarkers(plantes);
    } catch (error) {
      const fallback = 'Error en carregar les plantes al mapa';
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : fallback;
      this.errorMessage.set(message || fallback);
    } finally {
      this.loading.set(false);
    }
  }

  private renderMarkers(plantes: Planta[]) {
    if (!this.map) {
      return;
    }

    this.markersLayer.clearLayers();

    const validPlantes = plantes.filter((planta) => this.hasValidCoordinates(planta));

    if (validPlantes.length === 0) {
      this.errorMessage.set('No hi ha coordenades valides per mostrar al mapa');
      return;
    }

    const bounds = L.latLngBounds([]);

    validPlantes.forEach((planta) => {
      const marker = L.circleMarker([planta.ubicacio.latitude, planta.ubicacio.longitude], {
        radius: 8,
        fillColor: '#f97316',
        color: '#9a3412',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.85,
      });

      marker.bindPopup(
        `<strong>${planta.nom}</strong><br>ID: ${planta.id}<br>Capacitat: ${planta.capacitat}`,
      );

      marker.addTo(this.markersLayer);
      bounds.extend([planta.ubicacio.latitude, planta.ubicacio.longitude]);
    });

    this.map.fitBounds(bounds.pad(0.2));
  }

  private hasValidCoordinates(planta: Planta) {
    const { latitude, longitude } = planta.ubicacio;
    return Number.isFinite(latitude) && Number.isFinite(longitude);
  }
}
