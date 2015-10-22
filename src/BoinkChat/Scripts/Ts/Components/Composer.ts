class Composer extends Component {
    public send(): void {
        Application.instance.hub.server.sendMessage("User", (<HTMLInputElement>this.shadowRoot.querySelector("input")).value);
        (<HTMLInputElement>this.shadowRoot.querySelector("input")).value = "";
    }
}
Component.register("ui-composer", Composer);