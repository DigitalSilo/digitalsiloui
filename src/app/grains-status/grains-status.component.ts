import { Component, OnInit } from '@angular/core';
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

  constructor(
    private readonly sessionService : SessionService
  ) {
    this.inProgressGrains = new ListService<GrainResponse>();
    this.failedGrains = new ListService<GrainResponse>();
    this.completedGrains = new ListService<GrainResponse>();
   }

  ngOnInit(): void {
    this.sessionService.connect();
    this.sessionService.onCompleted.subscribe({
      next: response => {
        this.inProgressGrains.remove((item => item?.subjectGrainUId === response.subjectGrainUId));
        this.completedGrains.add(response);
      }
    });
    this.sessionService.onError.subscribe({
      next: response => {
        this.inProgressGrains.remove((item => item?.subjectGrainUId === response.subjectGrainUId));
        this.failedGrains.add(response);
      }
    });
    this.sessionService.onNext.subscribe({
      next: response => {
        this.inProgressGrains.add(response);
      }
    });
  }
}
