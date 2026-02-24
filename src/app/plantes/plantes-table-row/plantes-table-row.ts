import { Component, input, output } from '@angular/core';
import { Planta } from '../planta';
import { RouterLink } from '@angular/router';

@Component({
  selector: '[app-plantes-table-row]',
  imports: [RouterLink],
  templateUrl: './plantes-table-row.html',
  styleUrl: './plantes-table-row.css',
})
export class PlantesTableRow {
  //planta!: Planta; //!: asegura que la planta va a estar
  planta = input.required<Planta>({ alias: 'plantaId' }); //alias es el nom que tindra el atribut en el pare
  editarPlanta = output<Planta>();
  eliminarPlanta = output<number>();

  editar() {
    this.editarPlanta.emit(this.planta());
  }

  eliminar() {
    this.eliminarPlanta.emit(this.planta().id);
  }
}
