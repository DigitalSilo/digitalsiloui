import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class HubClientBaseService {
  protected hubConnection: HubConnection;

  constructor(
    protected readonly logger: LoggerService,
    private hubName: string
  ) { }

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
    if(this.isConnected){
      this.hubConnection.stop();
    }
    this.hubConnection = null;
    this.logger.log(LogLevel.Error, `Hub disconnected: ${this.hubName}`);
  }

  protected get isConnected(){
    if(this.hubConnection) {
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
