import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAddMyPlayerComponent } from './game-add-my-player.component';

describe('GameAddMyPlayerComponent', () => {
  let component: GameAddMyPlayerComponent;
  let fixture: ComponentFixture<GameAddMyPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameAddMyPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameAddMyPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
