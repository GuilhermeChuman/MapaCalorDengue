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
    path: 'charts',
    component: ChartsComponent,
  },
  {
    path: 'health-care',
    component: HealthCareComponent,
  },
  {
    path: 'help',
    component: ContactsComponent,
  },
//   {
//     path: '**',
//     component: NotFoundComponent,
//   },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}