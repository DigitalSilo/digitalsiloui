import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndPointDialogComponent } from './end-point-dialog.component';

describe('EndPointDialogComponent', () => {
  let component: EndPointDialogComponent;
  let fixture: ComponentFixture<EndPointDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndPointDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndPointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
