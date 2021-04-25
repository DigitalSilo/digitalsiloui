import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetScreenDialogComponent } from './reset-screen-dialog.component';

describe('ResetScreenDialogComponent', () => {
  let component: ResetScreenDialogComponent;
  let fixture: ComponentFixture<ResetScreenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetScreenDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetScreenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
