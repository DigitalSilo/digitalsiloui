import { Component, Inject, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { WatchDogInfo } from '../models/watch-dog-info';

@Component({
  selector: 'app-system-info-view',
  templateUrl: './system-info-view.component.html',
  styleUrls: ['./system-info-view.component.css']
})
export class SystemInfoViewComponent implements OnInit {
  public hunName: string;
  public watchDogUrl!: string;
  public systemIdentifier!: string;
  public environmentName: string;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: WatchDogInfo) {
    this.hunName = environment.signalR.hubName;
    this.watchDogUrl = data.url;
    this.systemIdentifier = data.accessKey;
    if (environment.production) {
      this.environmentName = 'Production';
    } else {
      this.environmentName = 'Non-production';
    }
  }

  ngOnInit(): void {
  }

}
