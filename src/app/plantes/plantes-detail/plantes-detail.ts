import { Component, computed, input } from '@angular/core';
import { PLANTA_DEMO } from '../plantes_demo';

@Component({
  selector: 'app-plantes-detail',
  imports: [],
  templateUrl: './plantes-detail.html',
  styleUrl: './plantes-detail.css',
})
export class PlantesDetail {
  id = input<string>();

  planta = computed(() => { //s'executa la funcio cada vegada que canvia this.id
    const idNum = Number(this.id());
    return PLANTA_DEMO.find(p=>p.id === idNum);
  })

}
