import { Component, input, output } from '@angular/core';
import { Planta } from '../planta';

@Component({
  selector: '[app-plantes-table-row]',
  imports: [],
  templateUrl: './plantes-table-row.html',
  styleUrl: './plantes-table-row.css',
})
export class PlantesTableRow {
  // planta!: Planta; // !: assegura que la planta hi serà
  planta = input.required<Planta>({ alias: 'plantaId' }); // àlies del nom de l'atribut al pare
  editarPlanta = output<Planta>();
  eliminarPlanta = output<number>();

  editar() {
    this.editarPlanta.emit(this.planta());
  }

  eliminar() {
    this.eliminarPlanta.emit(this.planta().id);
  }
}
