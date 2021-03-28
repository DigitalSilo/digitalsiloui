import { Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import { Subject } from 'rxjs';
import { NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public events: Subject<any> = new Subject();
  public hubName: string;
  protected hubConnection: HubConnection;

  constructor(
    protected logger: LoggerService,
    private readonly ngZone: NgZone,
    private readonly httpClient: HttpClient
  ) {
    this.hubName = 'negotiate2';
    this.connected = false;
  }

  public connect() {
    const negotiationHeaders = new HttpHeaders()
        .append('x-functions-key', environment.signalR.functionKey)
        .append('x-ms-signalr-userid', `${1234567890}`);

    if (!this.hubConnection === null) {
      const negotitationUrl = `${environment.signalR.watchdogUrl}/${environment.signalR.negotiateEndPoint}`;
      this.httpClient
        .request<any>('GET',negotitationUrl, {responseType:'json', headers: negotiationHeaders})
        .toPromise()
        .then(data => {
          this.logger.log(LogLevel.Debug, `Negotiation result: ${JSON.stringify(data)}`);
          const options: IHttpConnectionOptions = {
              accessTokenFactory: () => data.accessToken,
              logger: this.logger,
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

  protected establishConnection(onResolved: { () }, onRejected: { (message?: string) }) {
    this.hubConnection.start()
      .then(() => {
        onResolved();
      })
      .catch(() => 
      {
         this.logger.log(LogLevel.Error, `Failed to connect to signalR hub: ${this.hubName}`);
         onRejected('Failure in starting signalR connection.');
      });
  }

  protected disconnect() {
    if (this.isConnected){
      this.hubConnection.stop();
    }
    this.hubConnection = null;
    this.logger.log(LogLevel.Error, `Hub disconnected: ${this.hubName}`);
  }

  protected get isConnected(){
    if (this.connected && this.hubConnection !== null) {
      return this.hubConnection.state === HubConnectionState.Connected || this.hubConnection.state === HubConnectionState.Connecting;
    }
    return false;
  }

  protected onClosed() {
    this.hubConnection.onclose((error) => {
      this.logger.log(LogLevel.Warning, `Hub ${this.hubName} connection closed. ${error ? error.message : ''}`);
      this.disconnect();
    });
  }

  protected onReconnecting() {
    this.hubConnection.onreconnecting((error) => {
      if (this.hubConnection.state === HubConnectionState.Reconnecting) {
        this.logger.log(LogLevel.Warning, `Attempting to reconnect to the server due to ${error}`);
      }
    });
  }
}
