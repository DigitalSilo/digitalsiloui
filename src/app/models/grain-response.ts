import { Response } from "./response";
import { ResultCode } from "./resultCode";

export class GrainResponse {
    public subjectGrainUId: string = '';
    public stage: string = '';
    public response: Response = new Response();
    public resultToDisplay: string = '';

    public constructor() {
        this.resultToDisplay = ResultCode[this.response.resultCode];
    }
}