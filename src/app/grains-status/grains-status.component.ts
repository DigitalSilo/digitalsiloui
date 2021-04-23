import { Component, OnInit } from '@angular/core';
import { MatSnackBar,  MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { GrainResponse } from '../models/grain-response';
import { ListService } from '../services/list/list-service';
import { SessionService } from '../services/session/session.service';

@Component({
  selector: 'app-grains-status',
  templateUrl: './grains-status.component.html',
  styleUrls: ['./grains-status.component.css']
})
export class GrainsStatusComponent implements OnInit {
  public inProgressGrains: ListService<GrainResponse>;
  public failedGrains: ListService<GrainResponse>;
  public completedGrains: ListService<GrainResponse>;
  public begunGrains: ListService<GrainResponse>;
  public totalNumberOfGrains: number = 0;
  public startProgressBar: boolean = false;
  public begunGrainsBadge: string = '0';
  public inProgressGrainsBadge: string = '0';
  public failedGrainsBadge: string = '0';
  public completedGrainsBadge: string = '0';
  private horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private readonly sessionService : SessionService,
    private snackBar: MatSnackBar
  ) {
    this.inProgressGrains = new ListService<GrainResponse>();
    this.failedGrains = new ListService<GrainResponse>();
    this.completedGrains = new ListService<GrainResponse>();
    this.begunGrains = new ListService<GrainResponse>();
   }

  ngOnInit(): void {
    this.sessionService.connect();
    this.sessionService.onBegin.subscribe({
      next: response => {        
        this.begunGrains.add(response);
        this.activateProgressBarIfApplicable();
      }
    });    
    this.sessionService.onError.subscribe({
      next: response => {
        this.inProgressGrains.remove((item => item?.subjectGrainUId === response.subjectGrainUId));
        this.failedGrains.add(response);
        this.calculateTotalNumberOfGrains();
        this.activateProgressBarIfApplicable();
        this.populateBadges();
        this.openProperSnackBar();
      }
    });
    this.sessionService.onCompleted.subscribe({
      next: response => {
        this.inProgressGrains.remove((item => item?.subjectGrainUId === response.subjectGrainUId));      
        this.completedGrains.add(response);
        this.calculateTotalNumberOfGrains();
        this.activateProgressBarIfApplicable();
        this.populateBadges();
        this.openProperSnackBar();
      }
    });
    this.sessionService.onNext.subscribe({
      next: response => {
        this.begunGrains.remove((item => item?.subjectGrainUId === response.subjectGrainUId));
        this.inProgressGrains.add(response);
        this.calculateTotalNumberOfGrains();
        this.activateProgressBarIfApplicable();
        this.populateBadges();
        this.openProperSnackBar();
      }
    });
  }

  calculateTotalNumberOfGrains(): void {
    this.totalNumberOfGrains = this.completedGrains.length + this.failedGrains.length + this.inProgressGrains.length;
  }

  activateProgressBarIfApplicable(): void {
    this.startProgressBar = this.inProgressGrains.length > 0;
  }

  onReset(): void {
    this.inProgressGrains.reset();
    this.failedGrains.reset();
    this.completedGrains.reset();
    this.begunGrains.reset();
    this.calculateTotalNumberOfGrains();
    this.populateBadges();
  }

  openProperSnackBar(): void{
    if(this.failedGrains.length > 0 && this.inProgressGrains.length === 0) {
      this.openSnackBar(`${this.failedGrains.length} grain(s) reported as failed in the mill.`, 'Close');
    }

    if(this.completedGrains.length > 0 && this.inProgressGrains.length === 0) {
      this.openSnackBar(`${this.completedGrains.length} grain(s) reported as completed in the mill.`, 'Close'); 
    }
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 10000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  populateBadges(){
    if(this.begunGrains.length < 100){
      this.begunGrainsBadge = this.begunGrains.length.toString();
    } else {
      this.begunGrainsBadge = '99+';
    }

    if(this.inProgressGrains.length < 100){
      this.inProgressGrainsBadge = this.inProgressGrains.length.toString();
    } else {
      this.inProgressGrainsBadge = '99+';
    }

    if(this.failedGrains.length < 100){
      this.failedGrainsBadge = this.failedGrains.length.toString();
    } else {
      this.failedGrainsBadge = '99+';
    }

    if(this.completedGrains.length < 100){
      this.completedGrainsBadge = this.completedGrains.length.toString();
    } else {
      this.completedGrainsBadge = '99+';
    }
  }
}
