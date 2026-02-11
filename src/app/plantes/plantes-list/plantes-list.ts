import { Component, inject, signal } from '@angular/core';
import { PlantaCard } from '../planta-card/planta-card';
import { PLANTA_DEMO } from '../plantes_demo';
import { Planta } from '../planta';
import { Supaservice } from '../../services/supaservice';

@Component({
  selector: 'app-plantes-list',
  imports: [PlantaCard],
  templateUrl: './plantes-list.html',
  styleUrl: './plantes-list.css',
})
export class PlantesList {

  private supaservice: Supaservice = inject(Supaservice);

  //cards = signal<Planta[]>(PLANTA_DEMO);

  cards = signal<Planta[]>([]);
  ngOnInit(): void{
    this.cards.set(PLANTA_DEMO);
  }

  coretFavorit(planta: Planta){
    planta.favorite = !planta.favorite;
  }

}
