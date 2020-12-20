import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoundWriteComponent } from './game-round-write.component';

describe('GameRoundWriteComponent', () => {
  let component: GameRoundWriteComponent;
  let fixture: ComponentFixture<GameRoundWriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameRoundWriteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoundWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
