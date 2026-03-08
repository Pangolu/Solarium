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

  async coretFavorit(planta: Planta) {
    const favoritaNova = !(planta.favorite ?? false);

    try {
      await this.supaservice.actualitzarFavoritaUsuariActual(planta.id, favoritaNova);
      this.cards.update((plantes) =>
        plantes.map((item) =>
          item.id === planta.id
            ? {
                ...item,
                favorite: favoritaNova,
              }
            : item,
        ),
      );
    } catch (error) {
      const fallback = 'Error en actualitzar la planta favorita';
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : fallback;
      this.errorMessage.set(message || fallback);
    }
  }

  private async carregarPlantes() {
    this.errorMessage.set('');
    try {
      const plantes = await this.supaservice.getPlantesFromCurrentUser();
      this.cards.set(plantes);
    } catch (error) {
      this.cards.set([]);
      const fallback = 'Error en carregar les plantes';
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
