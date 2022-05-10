import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  }
//   {
//     path: 'profile',
//     component: ProfileComponent,
//   },
//   {
//     path: 'about',
//     component: AboutComponent,
//   },
//   {
//     path: 'help',
//     component: HelpComponent,
//   },
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