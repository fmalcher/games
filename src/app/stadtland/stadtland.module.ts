import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StadtlandRoutingModule } from './stadtland-routing.module';
import { StadtlandComponent } from './stadtland/stadtland.component';
import { StartComponent } from './start/start.component';
import { GameComponent } from './game/game.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GameLandingComponent } from './game-landing/game-landing.component';
import { GameAddMyPlayerComponent } from './game-add-my-player/game-add-my-player.component';
import { GameScoreTableComponent } from './game-score-table/game-score-table.component';
import { GamePlayerListComponent } from './game-player-list/game-player-list.component';
import { CategoriesFormComponent } from './categories-form/categories-form.component';
import { GameRoundLetterComponent } from './game-round-letter/game-round-letter.component';
import { GameRoundWriteComponent } from './game-round-write/game-round-write.component';
import { GameRoundPointsComponent } from './game-round-points/game-round-points.component';

@NgModule({
  declarations: [
    StadtlandComponent,
    StartComponent,
    GameComponent,
    CategoriesListComponent,
    GameLandingComponent,
    GameAddMyPlayerComponent,
    GameScoreTableComponent,
    GamePlayerListComponent,
    CategoriesFormComponent,
    GameRoundLetterComponent,
    GameRoundWriteComponent,
    GameRoundPointsComponent,
  ],
  imports: [CommonModule, StadtlandRoutingModule, ReactiveFormsModule],
})
export class StadtlandModule {}
