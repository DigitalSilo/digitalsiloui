import { Component, OnInit } from '@angular/core';
import { ListService } from '../services/list/list-service';
import { SessionService } from '../services/session/session.service';

@Component({
  selector: 'app-grains-status',
  templateUrl: './grains-status.component.html',
  styleUrls: ['./grains-status.component.css']
})
export class GrainsStatusComponent implements OnInit {
  public inProgressGrains: ListService<any>;
  public finishedGrains: ListService<any>;

  constructor(
    private readonly sessionService : SessionService
  ) {
    this.inProgressGrains = new ListService<any>();
    this.finishedGrains = new ListService<any>();
   }

  ngOnInit(): void {
    this.sessionService.connect();
  }
}
