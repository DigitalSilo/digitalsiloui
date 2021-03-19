import { Injectable } from '@angular/core';
import { HubClientBaseService } from '../hubclient/hub-client-base.service';
import { LoggerService } from '../logger/logger.service';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends HubClientBaseService {

  constructor(
    protected logger: LoggerService
  ) {
    super(logger, "MyHubName");
  }

  public connect() {
    const headers = new HttpHeaders()
        .append('x-functions-key', environment.signalR.FunctionKey)
        .append('x-ms-signalr-userid', `${1234567890}`);
  }
}
