import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadtlandComponent } from './stadtland.component';

describe('StadtlandComponent', () => {
  let component: StadtlandComponent;
  let fixture: ComponentFixture<StadtlandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StadtlandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StadtlandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
