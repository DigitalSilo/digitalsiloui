export class WatchDogInfo {
    public url: string = '';
    public accessKey: string = '';
    public clientKey: string = '';

  public get isValid(): boolean {
    if(this.url && this.accessKey && this.clientKey) {
        return true;
    }
    return false;
  }
}
