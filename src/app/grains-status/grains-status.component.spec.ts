import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrainsStatusComponent } from './grains-status.component';

describe('GrainsStatusComponent', () => {
  let component: GrainsStatusComponent;
  let fixture: ComponentFixture<GrainsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrainsStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrainsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
