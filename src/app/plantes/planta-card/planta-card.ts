import { Component, input, output } from '@angular/core';
import { Planta } from '../planta';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-planta-card',
  imports: [RouterLink],
  templateUrl: './planta-card.html',
  styleUrl: './planta-card.css',
})
export class PlantaCard {
  card = input.required<Planta>({ alias: 'plantaId' });
  private readonly defaultImage = '/imatge_predefinida.png';

  coretPreferit = output<void>(); //signal de output

  preferit() {
    this.coretPreferit.emit();
  }

  getImageSrc() {
    const rawFoto = this.card().foto?.trim();
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
}
