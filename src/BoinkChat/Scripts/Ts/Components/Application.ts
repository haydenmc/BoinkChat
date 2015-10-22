/// <reference path="Component.ts" />

declare var $: any;

class Application extends Component {
    public static instance;
    private _hub: any;
    public get hub(): any {
        return this._hub;
    }

    public createdCallback() {
        super.createdCallback();
        Application.instance = this;
        this._dataContext.value = new DataModel();

        // Connect to SignalR
        this._hub = $.connection.messagesHub;
        this._hub.client.messageReceived = (message) => {
            console.log(message);
            var m = new MessageModel();
            m.authorName.value = message.AuthorName;
            m.body.value = message.Body;
            m.messageId.value = message.MessageId;
            m.timeSent.value = message.TimeSent;
            this.dataContext.value.messages.value.push(m);
        }
        $.connection.hub.start()
    }
}

Component.register("ui-application", Application);
