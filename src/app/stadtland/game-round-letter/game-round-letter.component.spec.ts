import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoundLetterComponent } from './game-round-letter.component';

describe('GameRoundLetterComponent', () => {
  let component: GameRoundLetterComponent;
  let fixture: ComponentFixture<GameRoundLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameRoundLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoundLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
