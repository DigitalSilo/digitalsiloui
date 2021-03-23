import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrainsstatusComponent } from './grainsstatus.component';

describe('GrainsstatusComponent', () => {
  let component: GrainsstatusComponent;
  let fixture: ComponentFixture<GrainsstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrainsstatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrainsstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
