import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAvatarMetaComponent } from './player-avatar-meta.component';

describe('PlayerAvatarMetaComponent', () => {
  let component: PlayerAvatarMetaComponent;
  let fixture: ComponentFixture<PlayerAvatarMetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerAvatarMetaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerAvatarMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
