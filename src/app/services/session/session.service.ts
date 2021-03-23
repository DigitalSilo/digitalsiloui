import { Injectable } from '@angular/core';
import { HubClientBaseService } from '../hubclient/hub-client-base.service';
import { LoggerService } from '../logger/logger.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HubConnectionBuilder, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import { Subject } from 'rxjs';
import { NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends HubClientBaseService {
  public events: Subject<any> = new Subject();
  
  constructor(
    protected logger: LoggerService,
    private readonly ngZone: NgZone,
    private readonly httpClient: HttpClient
  ) {
    super(logger, "negotitate");
  }

  public connect() {
    const negotiationHeaders = new HttpHeaders()
        .append('x-functions-key', environment.signalR.functionKey)
        .append('x-ms-signalr-userid', `${1234567890}`);
    
    if(this.hubConnection === null) {
      const negotitationUrl = `${environment.signalR.watchdogUrl}/${environment.signalR.negotiateEndPoint}`;
      this.httpClient
        .request<any>('GET',negotitationUrl, {responseType:'json', headers: negotiationHeaders})
        .toPromise()
        .then(data => {
          this.logger.log(LogLevel.Debug, `Negotiation result: ${JSON.stringify(data)}`);
          const options: IHttpConnectionOptions = {
              logger: null,
              accessTokenFactory: () => data.accessToken,
              logMessageContent: true,
            };
          this.hubConnection = new HubConnectionBuilder()
            .withUrl(`${data.url}`, options)
            .withHubProtocol(new MessagePackHubProtocol())
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();
          this.hubConnection.on('CommandCompleted', (value) => {
              this.logger.log(LogLevel.Debug, `CommandCompleted: ${value}`);
              this.ngZone.run(() => this.events.next(value));
            });
          this.onReconnecting();
          this.onClosed();
          this.establishConnection(() => {}, e => {}); 
        }); 
    }
  }
}
