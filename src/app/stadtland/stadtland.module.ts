import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { StadtlandRoutingModule } from './stadtland-routing.module';
import { StadtlandComponent } from './stadtland/stadtland.component';
import { StartComponent } from './start/start.component';
import { GameComponent } from './game/game.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GameLandingComponent } from './game-landing/game-landing.component';
import { GameAddMyPlayerComponent } from './game-add-my-player/game-add-my-player.component';
import { GamePlayerListComponent } from './game-player-list/game-player-list.component';
import { CategoriesFormComponent } from './categories-form/categories-form.component';
import { GameRoundLetterComponent } from './game-round-letter/game-round-letter.component';
import { GameRoundWriteComponent } from './game-round-write/game-round-write.component';
import { GameRoundPointsComponent } from './game-round-points/game-round-points.component';
import { UrlCopyComponent } from './url-copy/url-copy.component';
import { AlarmPulseComponent } from './alarm-pulse/alarm-pulse.component';
import { HeadlineComponent } from './headline/headline.component';
import { PlayerAvatarMetaComponent } from './player-avatar-meta/player-avatar-meta.component';
import { GameWinnerComponent } from './game-winner/game-winner.component';
import { GameWinnerGraphicComponent } from './game-winner-graphic/game-winner-graphic.component';

@NgModule({
  declarations: [
    StadtlandComponent,
    StartComponent,
    GameComponent,
    CategoriesListComponent,
    GameLandingComponent,
    GameAddMyPlayerComponent,
    GamePlayerListComponent,
    CategoriesFormComponent,
    GameRoundLetterComponent,
    GameRoundWriteComponent,
    GameRoundPointsComponent,
    UrlCopyComponent,
    AlarmPulseComponent,
    HeadlineComponent,
    PlayerAvatarMetaComponent,
    GameWinnerComponent,
    GameWinnerGraphicComponent,
  ],
  imports: [CommonModule, StadtlandRoutingModule, ReactiveFormsModule, ClipboardModule],
})
export class StadtlandModule {}
