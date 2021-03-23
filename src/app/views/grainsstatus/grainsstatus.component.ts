import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session/session.service';

@Component({
  selector: 'app-grainsstatus',
  templateUrl: './grainsstatus.component.html',
  styleUrls: ['./grainsstatus.component.scss']
})
export class GrainsstatusComponent implements OnInit {

  constructor(
    private readonly sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.sessionService.connect();
  }

}
