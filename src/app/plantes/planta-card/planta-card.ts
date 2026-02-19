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

  coretPreferit = output<void>(); //signal de output

  preferit() {
    this.coretPreferit.emit();
  }
}
