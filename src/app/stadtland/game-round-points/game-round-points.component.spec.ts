import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoundPointsComponent } from './game-round-points.component';

describe('GameRoundPointsComponent', () => {
  let component: GameRoundPointsComponent;
  let fixture: ComponentFixture<GameRoundPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameRoundPointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoundPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
