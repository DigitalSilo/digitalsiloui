import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar,  MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { GrainResponse } from '../models/grain-response';
import { ResetScreenDialogComponent } from '../reset-screen-dialog/reset-screen-dialog.component';
import { ListService } from '../services/list/list-service';
import { SessionService } from '../services/session/session.service';
import { SystemInfoViewComponent } from '../system-info-view/system-info-view.component';
import { CookieService } from 'ngx-cookie';
import { WatchDogInfo } from '../models/watch-dog-info';
import { EndPointDialogComponent } from '../end-point-dialog/end-point-dialog.component';

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
  public totalNumberOfGrains = 0;
  public startProgressBar = false;
  public begunGrainsBadge = '0';
  public inProgressGrainsBadge = '0';
  public failedGrainsBadge = '0';
  public completedGrainsBadge = '0';
  private horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  private watchdogUrlCookie = 'grainfabricwatchdogurl';
  private watchdogAccessKeyCookie = 'grainfabricwatchdogaccesskey';
  private watchdogClientKeyCookie = 'grainfabricwatchdogclientkey';

  constructor(
    private readonly sessionService: SessionService,
    private cookieService: CookieService,
    private snackBar: MatSnackBar,
    private listResetDialog: MatDialog,
    private watchDogInfoDialog: MatDialog,
    private systemInfo: MatBottomSheet
  ) {
    this.inProgressGrains = new ListService<GrainResponse>();
    this.failedGrains = new ListService<GrainResponse>();
    this.completedGrains = new ListService<GrainResponse>();
    this.begunGrains = new ListService<GrainResponse>();
   }

  ngOnInit(): void {
    const watchDogInfo = this.getWatchDogInfo();
    if (!watchDogInfo.isValid) {
      this.openWatchDogInfoDialog(watchDogInfo);
    } else {
      this.listenToGrains(watchDogInfo);
    }
  }

  getWatchDogInfo(): WatchDogInfo {
    const watchDogInfo: WatchDogInfo = new WatchDogInfo();
    watchDogInfo.url = this.cookieService.get(this.watchdogUrlCookie);
    watchDogInfo.accessKey = this.cookieService.get(this.watchdogAccessKeyCookie);
    watchDogInfo.clientKey = this.cookieService.get(this.watchdogClientKeyCookie);
    return watchDogInfo;
  }

  saveWatchDogInfo(watchDogInfo: WatchDogInfo): void {
    this.cookieService.put(this.watchdogUrlCookie, watchDogInfo.url);
    this.cookieService.put(this.watchdogAccessKeyCookie, watchDogInfo.accessKey);
    this.cookieService.put(this.watchdogClientKeyCookie, watchDogInfo.clientKey);
  }

  onOpenWatchDog(): void{
    this.openWatchDogInfoDialog(this.getWatchDogInfo());
  }

  openWatchDogInfoDialog(currentWatchDogInfo: WatchDogInfo): void {
    const dialogRef = this.watchDogInfoDialog.open(EndPointDialogComponent, {
      width: '600px',
      data: {
        url: currentWatchDogInfo.url,
        accessKey: currentWatchDogInfo.accessKey,
        clientKey: currentWatchDogInfo.clientKey
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      const watchDogInfo = new WatchDogInfo();
      watchDogInfo.url = result.url;
      watchDogInfo.accessKey = result.accessKey;
      watchDogInfo.clientKey = result.clientKey;

      if (watchDogInfo.isValid) {
        this.openSnackBar('If your watchdog info is right, you will see the flow of statuses on this screen soon.', 'Ok');
        this.listenToGrains(watchDogInfo);
        this.saveWatchDogInfo(watchDogInfo);
      } else {
        this.openSnackBar('The watchdog info does not appear to be valid.', 'Close');
      }
    });
  }

  listenToGrains(watchDogInfo: WatchDogInfo): void {
    this.sessionService.connect(watchDogInfo);
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
        this.openProperGrainStatusSnackBar();
      }
    });
    this.sessionService.onCompleted.subscribe({
      next: response => {
        this.inProgressGrains.remove((item => item?.subjectGrainUId === response.subjectGrainUId));
        this.completedGrains.add(response);
        this.calculateTotalNumberOfGrains();
        this.activateProgressBarIfApplicable();
        this.populateBadges();
        this.openProperGrainStatusSnackBar();
      }
    });
    this.sessionService.onNext.subscribe({
      next: response => {
        this.begunGrains.remove((item => item?.subjectGrainUId === response.subjectGrainUId));
        this.inProgressGrains.add(response);
        this.calculateTotalNumberOfGrains();
        this.activateProgressBarIfApplicable();
        this.populateBadges();
        this.openProperGrainStatusSnackBar();
      }
    });
  }

  calculateTotalNumberOfGrains(): void {
    this.totalNumberOfGrains = this.completedGrains.length + this.failedGrains.length + this.inProgressGrains.length;
  }

  activateProgressBarIfApplicable(): void {
    this.startProgressBar = this.inProgressGrains.length > 0;
  }

  reset(): void {
    this.inProgressGrains.reset();
    this.failedGrains.reset();
    this.completedGrains.reset();
    this.begunGrains.reset();
    this.calculateTotalNumberOfGrains();
    this.populateBadges();
  }

  openProperGrainStatusSnackBar(): void{
    if (this.failedGrains.length > 0 && this.inProgressGrains.length === 0) {
      this.openSnackBar(`${this.failedGrains.length} grain(s) reported as failed in the mill.`, 'Close');
    }

    if (this.completedGrains.length > 0 && this.inProgressGrains.length === 0) {
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

  populateBadges(): void{
    if (this.begunGrains.length < 100){
      this.begunGrainsBadge = this.begunGrains.length.toString();
    } else {
      this.begunGrainsBadge = '99+';
    }

    if (this.inProgressGrains.length < 100){
      this.inProgressGrainsBadge = this.inProgressGrains.length.toString();
    } else {
      this.inProgressGrainsBadge = '99+';
    }

    if (this.failedGrains.length < 100){
      this.failedGrainsBadge = this.failedGrains.length.toString();
    } else {
      this.failedGrainsBadge = '99+';
    }

    if (this.completedGrains.length < 100){
      this.completedGrainsBadge = this.completedGrains.length.toString();
    } else {
      this.completedGrainsBadge = '99+';
    }
  }

  onOpenReset(): void{
    const reference = this.listResetDialog.open(ResetScreenDialogComponent);
    reference.afterClosed().subscribe(result => {
      if (result === true){
        this.reset();
      }
    });
  }

  onOpenSystemInfo(): void{
    this.systemInfo.open(SystemInfoViewComponent, { data: this.getWatchDogInfo() });
  }
}
