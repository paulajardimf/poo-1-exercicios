export class Video {
  constructor(
    private id: string,
    private title: string,
    private duration: number,
    private uploadAt: string
  ) {}

  public getId(): string {
    return this.id;
  }
  public setId(value: string):void {
    this.id = value;
  }
  public getTitle(): string {
    return this.title;
  }
  public setTitle(value: string):void {
    this.title = value;
  }
  public getDuration(): number {
    return this.duration;
  }
  public setDuration(value: number):void {
    this.duration = value;
  }
  public getUploadAt(): string {
    return this.uploadAt;
  }
  public setUploadAt(value: string):void {
    this.uploadAt = value;
  }
}