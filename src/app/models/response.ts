export class Response {
    resultCode: number = 0;
    message: string = '';
    isSystemResponse: boolean = false;
    details: Array<any> = new Array<any>();
    responseTimeUTC: Date | undefined;
}
