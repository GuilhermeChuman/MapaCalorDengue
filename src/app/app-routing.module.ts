import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartsComponent } from './components/charts/charts.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { HealthCareComponent } from './components/health-care/health-care.component';
import { MapaComponent } from './components/mapa/mapa.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'mapa',
    component: MapaComponent,
  },
  {
    path: 'home',
    component: MapaComponent,
  },
  {
    path: 'metricas',
    component: ChartsComponent,
  },
  {
    path: 'dicas',
    component: HealthCareComponent,
  },
  {
    path: 'contato',
    component: ContactsComponent,
  },
  // {
  //   path: '**',
  //   component: MapaComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}