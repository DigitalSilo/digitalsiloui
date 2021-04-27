import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-system-info-view',
  templateUrl: './system-info-view.component.html',
  styleUrls: ['./system-info-view.component.css']
})
export class SystemInfoViewComponent implements OnInit {
  public hunName: string;
  public watchDogUrl: string;
  public systemIdentifier: string;
  public environmentName: string;

  constructor() {
    this.hunName = environment.signalR.hubName;
    this.watchDogUrl = environment.signalR.watchdogUrl;
    this.systemIdentifier = environment.signalR.clientKey;

    if (environment.production) {
      this.environmentName = 'Production';
    } else {
      this.environmentName = 'Non-production';
    }
  }

  ngOnInit(): void {
  }

}
