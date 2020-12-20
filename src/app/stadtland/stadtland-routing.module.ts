import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameLandingComponent } from './game-landing/game-landing.component';
import { GameRoundLetterComponent } from './game-round-letter/game-round-letter.component';
import { GameRoundPointsComponent } from './game-round-points/game-round-points.component';
import { GameRoundWriteComponent } from './game-round-write/game-round-write.component';
import { GameComponent } from './game/game.component';
import { StadtlandComponent } from './stadtland/stadtland.component';
import { StartComponent } from './start/start.component';

const routes: Routes = [
  {
    path: '',
    component: StadtlandComponent,
    children: [
      { path: '', component: StartComponent },
      {
        path: ':gameId',
        component: GameComponent,
        children: [
          { path: '', redirectTo: 'landing', pathMatch: 'full' },
          { path: 'landing', component: GameLandingComponent },
          { path: 'dice', component: GameRoundLetterComponent },
          { path: 'write', component: GameRoundWriteComponent },
          { path: 'points', component: GameRoundPointsComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StadtlandRoutingModule {}
