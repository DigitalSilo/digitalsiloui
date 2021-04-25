export class Response {
    resultCode = 0;
    message = '';
    isSystemResponse = false;
    details: Array<any> = new Array<any>();
    responseTimeUTC: Date | undefined;
}
