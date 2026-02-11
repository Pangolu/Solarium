import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { PlantesTable } from "./plantes/plantes-table/plantes-table";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, PlantesTable],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('solarium');
}
