import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session/session.service';

@Component({
  selector: 'app-grains-status',
  templateUrl: './grains-status.component.html',
  styleUrls: ['./grains-status.component.css']
})
export class GrainsStatusComponent implements OnInit {

  constructor(
    private readonly sessionService : SessionService
  ) { }

  ngOnInit(): void {
    this.sessionService.connect();
  }

}
