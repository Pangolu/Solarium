import { Component,input } from '@angular/core';
import { Planta } from '../planta';

@Component({
  selector: '[app-plantes-table-row]',
  imports: [],
  templateUrl: './plantes-table-row.html',
  styleUrl: './plantes-table-row.css',
})
export class PlantesTableRow {

  //planta!: Planta; //!: asegura que la planta va a estar
  planta = input.required<Planta>({alias: 'plantaId'});//alias es el nom que tindra el atribut en el pare
}
