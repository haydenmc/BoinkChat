declare class Component extends HTMLElement {
    protected shadowRoot: any;
    protected _dataContext: Observable<any>;
    dataContext: Observable<any>;
    protected dataBinder: DataBinder;
    constructor();
    static register(elementName: string, theClass: any): void;
    createdCallback(): void;
    attachedCallback(): void;
    protected processDataContextAttributeBinding(): void;
    protected applyShadowTemplate(): void;
    protected processEventBindings(node: Node): void;
    protected applyMyDataContext(node: Node, dataContext?: Observable<any>): void;
    detachedCallback(): void;
    attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void;
}
declare class Application extends Component {
    static instance: any;
    createdCallback(): void;
}
declare class Repeater extends Component {
    private template;
    private itemNodes;
    private itemNodeBindings;
    createdCallback(): void;
    dataContextUpdated(): void;
    itemAdded(arg: ObservableArrayEventArgs<any>): void;
    itemRemoved(arg: ObservableArrayEventArgs<any>): void;
    attachedCallback(): void;
    private populateAllItems();
}
declare class Observable<T> {
    private _value;
    value: T;
    private _onValueChanged;
    onValueChanged: EventHandler<ValueChangedEvent<T>>;
    constructor(defaultValue?: T);
}
interface ValueChangedEvent<T> {
    oldValue: T;
    newValue: T;
}
interface ObservableArrayEventArgs<T> {
    item: T;
    position: number;
}
declare class ObservableArray<T> {
    itemAdded: EventHandler<ObservableArrayEventArgs<T>>;
    itemRemoved: EventHandler<ObservableArrayEventArgs<T>>;
    size: number;
    private itemStore;
    constructor();
    push(item: T): void;
    insert(item: T, index: number): void;
    get(index: number): T;
    remove(item: T): void;
    removeAt(index: number): void;
    indexOf(item: T): number;
}
declare class DataBinder {
    static bindingRegex: RegExp;
    protected nodeDataBindings: Array<NodeDataBindingInformation>;
    protected _dataContext: Observable<any>;
    dataContext: Observable<any>;
    constructor(dataContext?: Observable<any>);
    processBindings(node: Node, dataContext?: Observable<any>): Array<NodeDataBindingInformation>;
    resolveBinding(bindingInfo: NodeDataBindingInformation): void;
    resolveBindings(bindingInfo: Array<NodeDataBindingInformation>): void;
    resolveAllBindings(): void;
    releaseBinding(bindingInfo: NodeDataBindingInformation): void;
    releaseBindings(bindingInfo: Array<NodeDataBindingInformation>): void;
}
declare class NodeDataBindingInformation {
    dataContext: Observable<any>;
    bindingPath: string;
    node: Node;
    originalText: string;
    updateCallback: (args: ValueChangedEvent<any>) => void;
}
declare class EventHandler<T> {
    private callbacks;
    constructor();
    subscribe(callback: (arg: T) => void): void;
    unSubscribe(callback: (arg: T) => void): void;
    fire(arg: T): void;
}
