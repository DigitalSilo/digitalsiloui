import { Injectable } from '@angular/core';
import { ILogger, LogLevel } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class LoggerService implements ILogger {

  constructor() { }
  
  log(logLevel: LogLevel, message: string): void {
    switch (logLevel) {
            case LogLevel.Critical:
              console.error(`%c${LogLevel[logLevel]}: ${message}`, 'color: red;');
                break;
            case LogLevel.Error:
                console.error(`%c${LogLevel[logLevel]}: ${message}`, 'color: orange;');
                break;
            case LogLevel.Warning:
                console.warn(`%c${LogLevel[logLevel]}: ${message}`, 'color: yellow;');
                break;
            case LogLevel.Information:
                console.log(`${LogLevel[logLevel]}: ${message}`, 'color: white;');
                break;
            case LogLevel.Debug:
                console.log(`%c${LogLevel[logLevel]}: ${message}`, 'color: blue;');
                break;
            case LogLevel.Trace:
                console.log(`%c${LogLevel[logLevel]}: ${message}`, 'color: purple;');
                break;
            default:
                console.log(`%c${LogLevel[logLevel]}: ${message}`, 'color: cyan;');
                break;
        }
  }
}
