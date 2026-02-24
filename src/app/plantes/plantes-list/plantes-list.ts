import { Component, inject, signal } from '@angular/core';
import { PlantaCard } from '../planta-card/planta-card';
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

  cards = signal<Planta[]>([]);
  errorMessage = signal<string>('');

  async ngOnInit() {
    await this.carregarPlantes();
  }

  coretFavorit(planta: Planta) {
    planta.favorite = !planta.favorite;
  }

  private async carregarPlantes() {
    this.errorMessage.set('');
    try {
      const plantes = await this.supaservice.getPlantesFromCurrentUser();
      this.cards.set(plantes);
    } catch (error) {
      this.cards.set([]);
      const fallback = 'Error al carregar les plantes';
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
