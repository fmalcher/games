import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesFormComponent } from './categories-form/categories-form.component';
import { GameLandingComponent } from './game-landing/game-landing.component';
import { GameRoundLetterComponent } from './game-round-letter/game-round-letter.component';
import { GameRoundPointsComponent } from './game-round-points/game-round-points.component';
import { GameRoundWriteComponent } from './game-round-write/game-round-write.component';
import { GameWinnerComponent } from './game-winner/game-winner.component';
import { GameComponent } from './game/game.component';
import { ConfirmLeaveWriteGuard } from './shared/confirm-leave-write.guard';
import { CurrentGameGuard } from './shared/current-game.guard';
import { GameState } from './shared/models';
import { StateRedirectGuard } from './shared/state-redirect.guard';
import { StartComponent } from './start/start.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  {
    path: ':gameId',
    component: GameComponent,
    canActivate: [CurrentGameGuard],
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
      { path: 'landing', component: GameLandingComponent },
      {
        path: 'categories',
        component: CategoriesFormComponent,
      },
      {
        path: 'dice',
        component: GameRoundLetterComponent,
        data: {
          redirectWhenState: {
            [GameState.RoundGivingPoints]: 'points',
            [GameState.RoundWriting]: 'write',
            [GameState.StartedIdle]: 'landing',
          },
        },
        canActivate: [StateRedirectGuard],
      },
      {
        path: 'write',
        component: GameRoundWriteComponent,
        data: {
          redirectWhenState: {
            [GameState.RoundDicing]: 'dice',
            [GameState.RoundGivingPoints]: 'points',
            [GameState.StartedIdle]: 'landing',
          },
        },
        canActivate: [StateRedirectGuard],
        canDeactivate: [ConfirmLeaveWriteGuard],
      },
      {
        path: 'points',
        component: GameRoundPointsComponent,
        data: {
          redirectWhenState: {
            [GameState.RoundDicing]: 'dice',
            [GameState.RoundWriting]: 'write',
            [GameState.StartedIdle]: 'landing',
          },
        },
        canActivate: [StateRedirectGuard],
      },
      {
        path: 'winner',
        component: GameWinnerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StadtlandRoutingModule {}
