/// <reference path="../../definitions/boink.d.ts" />

declare var $: any;

class BoinkChat extends Application {
    private _hub: any;
    public get hub(): any {
        return this._hub;
    }

    public createdCallback() {
        super.createdCallback();
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

Component.register("ui-boinkchat", BoinkChat);
