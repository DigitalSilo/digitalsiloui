import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WatchDogInfo } from '../models/watch-dog-info';

@Component({
  selector: 'app-end-point-dialog',
  templateUrl: './end-point-dialog.component.html',
  styleUrls: ['./end-point-dialog.component.css']
})
export class EndPointDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EndPointDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WatchDogInfo
  ) { }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
