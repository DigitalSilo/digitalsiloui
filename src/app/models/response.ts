import { ResultCode } from "./ResultCode";

export class Response {
    resultCode: number = 0;
    message: string = '';
    details: Array<any> = new Array<any>();
}
