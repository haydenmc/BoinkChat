class DataModel {
    public messages: Observable<ObservableArray<MessageModel>> = new Observable<ObservableArray<MessageModel>>(new ObservableArray<MessageModel>());
}