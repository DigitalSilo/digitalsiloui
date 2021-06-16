import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface WatchdogInfo {
  url: string;
  accessKey: string;
}

@Component({
  selector: 'app-end-point-dialog',
  templateUrl: './end-point-dialog.component.html',
  styleUrls: ['./end-point-dialog.component.css']
})
export class EndPointDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EndPointDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WatchdogInfo
  ) { }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
