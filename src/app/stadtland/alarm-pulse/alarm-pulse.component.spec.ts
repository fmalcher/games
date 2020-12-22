import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmPulseComponent } from './alarm-pulse.component';

describe('AlarmPulseComponent', () => {
  let component: AlarmPulseComponent;
  let fixture: ComponentFixture<AlarmPulseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlarmPulseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmPulseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
