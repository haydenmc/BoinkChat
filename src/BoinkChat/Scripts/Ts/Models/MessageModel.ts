class MessageModel {
    public messageId: Observable<string> = new Observable("");
    public authorName: Observable<string> = new Observable("");
    public body: Observable<string> = new Observable("");
    public timeSent: Observable<Date> = new Observable(new Date());
}