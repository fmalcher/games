import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'slf', pathMatch: 'full' },
  {
    path: 'slf',
    loadChildren: () => import('./stadtland/stadtland.module').then(m => m.StadtlandModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
