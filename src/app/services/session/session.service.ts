import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgZone } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public events: Subject<any> = new Subject();
  public hubName: string;
  protected hubConnection: HubConnection | undefined;

  constructor(
    protected logger: LoggerService,
    private readonly ngZone: NgZone,
    private readonly httpClient: HttpClient
  ) {
    this.hubName = 'negotiate2';
  }

  public connect() {
    if (this.hubConnection === undefined) {
      const negotitationUrl = `${environment.signalR.watchdogUrl}${environment.signalR.negotiateEndPoint}`;
      this.httpClient
        .request<any>('GET', negotitationUrl, {
          headers: {
            'x-functions-key': environment.signalR.functionKey,
            'x-ms-signalr-userid': environment.signalR.clientKey,
          },
          responseType: 'json',
        })
        .toPromise()
        .then((data) => {
          this.logger.log(LogLevel.Debug, `Negotiation result: ${JSON.stringify(data)}`);
          const options: IHttpConnectionOptions = {
              accessTokenFactory: () => data.accessToken,
              logger: this.logger,
              logMessageContent: true,
            };
          this.hubConnection = new HubConnectionBuilder()
            .withUrl(`${data.url}`, options)
            //.withHubProtocol(new MessagePackHubProtocol())
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();
          this.hubConnection.on('onNext', (value) => {
              this.logger.log(LogLevel.Debug, `onNext: ${value}`);
              this.ngZone.run(() => this.events.next(value));
            });
            this.hubConnection.on('onCompleted', (value) => {
              this.logger.log(LogLevel.Debug, `onCompleted: ${value}`);
              this.ngZone.run(() => this.events.next(value));
            });
            this.hubConnection.on('onError', (value) => {
              this.logger.log(LogLevel.Debug, `onError: ${value}`);
              this.ngZone.run(() => this.events.next(value));
            });  
          this.onReconnecting();
          this.onClosed();
          this.establishConnection(() => {}, (e) => {
            this.logger.log(LogLevel.Error, `Failed to connect to signalR hub: ${this.hubName} - Error: ${e}`);
          });
        }).catch((error) => {
          this.logger.log(LogLevel.Error, error.message);
        });
    }
  }

  protected establishConnection(onResolved: () => void, onRejected: (message?: string) => void) {
    this.hubConnection?.start()
      .then(() => {
        onResolved();
      })
      .catch(() => {
         onRejected('Failure in starting signalR connection.');
      });
  }

  protected disconnect() {
    if (this.isConnected){
      this.hubConnection?.stop();
    }
    this.hubConnection = undefined;
    this.logger.log(LogLevel.Error, `Hub disconnected: ${this.hubName}`);
  }

  protected get isConnected() {
    if (this.hubConnection !== undefined) {
      return this.hubConnection?.state === HubConnectionState.Connected || this.hubConnection?.state === HubConnectionState.Connecting;
    }
    return false;
  }

  protected onClosed() {
    this.hubConnection?.onclose((error) => {
      this.logger.log(LogLevel.Warning, `Hub ${this.hubName} connection closed. ${error ? error.message : ''}`);
      this.disconnect();
    });
  }

  protected onReconnecting() {
    this.hubConnection?.onreconnecting((error) => {
      if (this.hubConnection?.state === HubConnectionState.Reconnecting) {
        this.logger.log(LogLevel.Warning, `Attempting to reconnect to the server due to ${error}`);
      }
    });
  }
}
