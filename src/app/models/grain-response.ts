import { Response } from './response';
import { ResultCode } from './resultCode';

export class GrainResponse {
    public subjectGrainUId = '';
    public stage = '';
    public response: Response = new Response();
    public entirePayload = '';
    public resultToDisplay = '';

    public constructor() {
        this.resultToDisplay = ResultCode[this.response.resultCode];
    }
}