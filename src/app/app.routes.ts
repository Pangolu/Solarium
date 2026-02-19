import { Routes } from '@angular/router';
import { PlantesList } from './plantes/plantes-list/plantes-list';
import { PlantesTable } from './plantes/plantes-table/plantes-table';
import { PlantesDetail } from './plantes/plantes-detail/plantes-detail';
import { Home } from './home/home';
import { Register } from './components/register/register';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'plantes', component: PlantesList, canActivate: [authGuard] },
  { path: 'plantes_table', component: PlantesTable, canActivate: [authGuard] },
  { path: 'planta/:id', component: PlantesDetail, canActivate: [authGuard] },
  { path: 'login', pathMatch: 'full', redirectTo: 'home' },
  { path: 'register', component: Register },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', redirectTo: 'home' },
];
