var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Component = (function (_super) {
    __extends(Component, _super);
    function Component() {
        _super.call(this);
        this.createdCallback();
    }
    Object.defineProperty(Component.prototype, "dataContext", {
        get: function () {
            return this._dataContext;
        },
        enumerable: true,
        configurable: true
    });
    Component.register = function (elementName, theClass) {
        document.registerElement(elementName, {
            prototype: theClass.prototype
        });
    };
    Component.prototype.createdCallback = function () {
        console.log("Component created: " + this.tagName);
        this._dataContext = new Observable();
        this.dataBinder = new DataBinder(this.dataContext);
    };
    Component.prototype.attachedCallback = function () {
        console.log("Component attached.");
        if (this.dataContext.value == null) {
            var parentElement = this;
            while (typeof parentElement.dataContext === "undefined" || parentElement.dataContext.value == null) {
                parentElement = parentElement.parentElement;
                if (parentElement == null) {
                    throw new Error("No data context could be found in parents for element '" + this.tagName + "'");
                }
            }
            this._dataContext = parentElement.dataContext;
        }
        this.processDataContextAttributeBinding();
        this.applyShadowTemplate();
    };
    Component.prototype.processDataContextAttributeBinding = function () {
        var dataContextAttr = this.attributes.getNamedItem("data-context");
        if (dataContextAttr != null && dataContextAttr.value !== "") {
            var dataContextAttrBindingMatches = dataContextAttr.value.match(DataBinder.bindingRegex);
            if (dataContextAttrBindingMatches != null && dataContextAttrBindingMatches.length > 0) {
                var dataContextAttrBindingName = dataContextAttrBindingMatches[0].substr(2, dataContextAttrBindingMatches[0].length - 4);
                if (typeof this.dataContext.value[dataContextAttrBindingName] !== "undefined") {
                    this._dataContext = this.dataContext.value[dataContextAttrBindingName];
                }
                else {
                    throw new Error("Couldn't bind data context to non-existing property '"
                        + dataContextAttrBindingName + "' in " + this.tagName + ".");
                }
            }
            else {
                throw new Error("Couldn't parse data context binding expression '"
                    + dataContextAttr.value + "' of " + this.tagName
                    + ". Bindings should be of format {{bindingPropertyName}}.");
            }
        }
    };
    Component.prototype.applyShadowTemplate = function () {
        var template = document.querySelector("template#" + this.tagName.toLowerCase());
        if (typeof template !== "undefined" && template != null) {
            var clone = document.importNode(template.content, true);
            this.shadowRoot = this.createShadowRoot();
            for (var i = 0; i < clone.childNodes.length; i++) {
                this.applyMyDataContext(clone.childNodes[i]);
            }
            this.shadowRoot.appendChild(clone);
            this.dataBinder.processBindings(this.shadowRoot);
            this.dataBinder.resolveAllBindings();
            this.processEventBindings(this.shadowRoot);
        }
    };
    Component.prototype.processEventBindings = function (node) {
        var _this = this;
        if (node.nodeType === 1) {
            for (var i = 0; i < node.attributes.length; i++) {
                var attrName = node.attributes[i].name.toLowerCase();
                var attrValue = node.attributes[i].value;
                if (attrName.substr(0, 11) === "data-event-") {
                    var eventName = attrName.substr(11, attrName.length - 11);
                    if (typeof this[attrValue] !== "undefined") {
                        node.addEventListener(eventName, function (arg) { return _this[attrValue](arg); });
                    }
                }
            }
        }
        for (var i = 0; i < node.childNodes.length; i++) {
            this.processEventBindings(node.childNodes[i]);
        }
    };
    Component.prototype.applyMyDataContext = function (node, dataContext) {
        if (typeof dataContext === "undefined" || dataContext == null) {
            dataContext = this.dataContext;
        }
        if (node instanceof Component) {
            node._dataContext.value = dataContext.value;
        }
        else {
            for (var i = 0; i < node.childNodes.length; i++) {
                this.applyMyDataContext(node.childNodes[i], dataContext);
            }
        }
    };
    Component.prototype.detachedCallback = function () {
        console.log("Component detached.");
    };
    Component.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        console.log("Attribute '" + attrName + "' changed.");
        if (typeof this[attrName] !== "undefined") {
            if (this[attrName] instanceof Observable) {
                this[attrName].value = newVal;
            }
            else {
                this[attrName] = newVal;
            }
        }
    };
    return Component;
})(HTMLElement);
/// <reference path="Component.ts" />
var Application = (function (_super) {
    __extends(Application, _super);
    function Application() {
        _super.apply(this, arguments);
    }
    Application.prototype.createdCallback = function () {
        _super.prototype.createdCallback.call(this);
        Application.instance = this;
    };
    return Application;
})(Component);
Component.register("ui-application", Application);
/// <reference path="Component.ts" />
var Repeater = (function (_super) {
    __extends(Repeater, _super);
    function Repeater() {
        _super.apply(this, arguments);
    }
    Repeater.prototype.createdCallback = function () {
        _super.prototype.createdCallback.call(this);
        this.itemNodes = new Array();
        this.itemNodeBindings = new Array();
    };
    Repeater.prototype.dataContextUpdated = function () {
        var _this = this;
        for (var i = 0; i < this.itemNodes.length; i++) {
            for (var j = 0; j < this.itemNodes[i].length; j++) {
                this.itemNodes[i][j].parentNode.removeChild(this.itemNodes[i][j]);
            }
        }
        this.itemNodes.splice(0, this.itemNodes.length);
        this.itemNodeBindings.splice(0, this.itemNodeBindings.length);
        this.populateAllItems();
        this.dataContext.value.itemAdded.subscribe(function (arg) { return _this.itemAdded(arg); });
        this.dataContext.value.itemRemoved.subscribe(function (arg) { return _this.itemRemoved(arg); });
    };
    Repeater.prototype.itemAdded = function (arg) {
        var itemDataContext = new Observable(arg.item);
        var clone = document.importNode(this.template.content, true);
        var cloneNodes = new Array();
        for (var j = 0; j < clone.childNodes.length; j++) {
            cloneNodes.push(clone.childNodes[j]);
            this.applyMyDataContext(clone.childNodes[j], itemDataContext);
        }
        var refNode = null;
        if (arg.position < this.itemNodes.length) {
            refNode = this.itemNodes[arg.position][0];
        }
        this.itemNodes.splice(arg.position, 0, cloneNodes);
        if (arg.position === this.dataContext.value.size - 1) {
            this.appendChild(clone);
        }
        else {
            this.insertBefore(clone, refNode);
        }
        var itemBindings = new Array();
        for (var j = 0; j < cloneNodes.length; j++) {
            var nodeBindings = this.dataBinder.processBindings(cloneNodes[j], itemDataContext);
            for (var k = 0; k < nodeBindings.length; k++) {
                itemBindings.push(nodeBindings[k]);
            }
        }
        this.itemNodeBindings.splice(arg.position, 0, itemBindings);
        this.dataBinder.resolveBindings(itemBindings);
    };
    Repeater.prototype.itemRemoved = function (arg) {
        var itemBindings = this.itemNodeBindings[arg.position];
        this.dataBinder.releaseBindings(itemBindings);
        this.itemNodeBindings.splice(arg.position, 1);
        var nodesToBeRemoved = this.itemNodes[arg.position];
        for (var i = 0; i < nodesToBeRemoved.length; i++) {
            nodesToBeRemoved[i].parentNode.removeChild(nodesToBeRemoved[i]);
        }
        this.itemNodes.splice(arg.position, 1);
    };
    Repeater.prototype.attachedCallback = function () {
        var _this = this;
        _super.prototype.attachedCallback.call(this);
        this.template = this.querySelector("template");
        if (this.template == null) {
            throw new Error("Template undefined for repeater component."
                + " A repeater element should always contain a template element.");
        }
        if (!(this.dataContext.value instanceof ObservableArray)) {
            throw new Error("Invalid data context for repeater component."
                + " A repeater element should have an observable array set as the data context.");
        }
        this.dataContext.onValueChanged.subscribe(function () {
            _this.dataContextUpdated();
        });
        this.dataContextUpdated();
    };
    Repeater.prototype.populateAllItems = function () {
        var array = this.dataContext.value;
        for (var i = 0; i < array.size; i++) {
            var itemDataContext = new Observable(array.get(i));
            var clone = document.importNode(this.template.content, true);
            var cloneNodes = new Array();
            for (var j = 0; j < clone.childNodes.length; j++) {
                cloneNodes.push(clone.childNodes[j]);
                this.applyMyDataContext(clone.childNodes[j], itemDataContext);
            }
            this.itemNodes.push(cloneNodes);
            this.appendChild(clone);
            var itemBindings = new Array();
            for (var j = 0; j < cloneNodes.length; j++) {
                var nodeBindings = this.dataBinder.processBindings(cloneNodes[j], itemDataContext);
                for (var k = 0; k < nodeBindings.length; k++) {
                    itemBindings.push(nodeBindings[k]);
                }
            }
            this.itemNodeBindings.push(itemBindings);
        }
        this.dataBinder.resolveAllBindings();
    };
    return Repeater;
})(Component);
Component.register("ui-repeater", Repeater);
var Observable = (function () {
    function Observable(defaultValue) {
        this._onValueChanged = new EventHandler();
        this._value = defaultValue;
    }
    Object.defineProperty(Observable.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (newVal) {
            if (this._value !== newVal) {
                var oldVal = this._value;
                this._value = newVal;
                this._onValueChanged.fire({ oldValue: oldVal, newValue: newVal });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Observable.prototype, "onValueChanged", {
        get: function () {
            return this._onValueChanged;
        },
        enumerable: true,
        configurable: true
    });
    return Observable;
})();
var ObservableArray = (function () {
    function ObservableArray() {
        this.itemStore = new Array();
        this.itemAdded = new EventHandler();
        this.itemRemoved = new EventHandler();
    }
    Object.defineProperty(ObservableArray.prototype, "size", {
        get: function () {
            return this.itemStore.length;
        },
        enumerable: true,
        configurable: true
    });
    ObservableArray.prototype.push = function (item) {
        this.itemStore.push(item);
        this.itemAdded.fire({ item: item, position: this.itemStore.length - 1 });
    };
    ObservableArray.prototype.insert = function (item, index) {
        this.itemStore.splice(index, 0, item);
        this.itemAdded.fire({ item: item, position: index });
    };
    ObservableArray.prototype.get = function (index) {
        return this.itemStore[index];
    };
    ObservableArray.prototype.remove = function (item) {
        var index = this.itemStore.indexOf(item);
        if (index < 0) {
            throw "Item not found in array";
        }
        this.itemStore.splice(index, 1);
        this.itemRemoved.fire({ item: item, position: index });
    };
    ObservableArray.prototype.removeAt = function (index) {
        if (index > this.size - 1) {
            throw "Index outside of array bounds.";
        }
        var item = this.itemStore[index];
        this.itemStore.splice(index, 1);
        this.itemRemoved.fire({ item: item, position: index });
    };
    ObservableArray.prototype.indexOf = function (item) {
        return this.itemStore.indexOf(item);
    };
    return ObservableArray;
})();
var DataBinder = (function () {
    function DataBinder(dataContext) {
        this._dataContext = dataContext;
        this.nodeDataBindings = new Array();
    }
    Object.defineProperty(DataBinder.prototype, "dataContext", {
        get: function () {
            return this._dataContext;
        },
        enumerable: true,
        configurable: true
    });
    DataBinder.prototype.processBindings = function (node, dataContext) {
        var _this = this;
        var addedBindings = new Array();
        if (typeof dataContext === "undefined" || dataContext == null) {
            dataContext = this.dataContext;
        }
        if (node.nodeType === 1 || node.nodeType === 11) {
            for (var i = 0; i < node.childNodes.length; i++) {
                var recursiveResult = this.processBindings(node.childNodes[i], dataContext);
                for (var j = 0; j < recursiveResult.length; j++) {
                    addedBindings.push(recursiveResult[j]);
                }
            }
        }
        else if (node.nodeType === 3) {
            var bindingMatches = node.nodeValue.match(DataBinder.bindingRegex);
            if (bindingMatches != null && bindingMatches.length > 0) {
                for (var i = 0; i < bindingMatches.length; i++) {
                    var path = bindingMatches[i].substr(2, bindingMatches[i].length - 4);
                    if (dataContext != null &&
                        dataContext.value != null &&
                        typeof dataContext.value[path] !== "undefined") {
                        var bindingInfo = {
                            dataContext: dataContext,
                            node: node,
                            bindingPath: path,
                            originalText: node.nodeValue,
                            updateCallback: null
                        };
                        bindingInfo.updateCallback = function (args) {
                            _this.resolveBinding(bindingInfo);
                        };
                        dataContext.value[path].onValueChanged.subscribe(bindingInfo.updateCallback);
                        this.nodeDataBindings.push(bindingInfo);
                        addedBindings.push(bindingInfo);
                    }
                    else {
                        throw new Error("Node data-binding failed on non- existing property '" + path + "'.");
                    }
                }
            }
        }
        return addedBindings;
    };
    DataBinder.prototype.resolveBinding = function (bindingInfo) {
        var text = bindingInfo.originalText;
        var matches = text.match(DataBinder.bindingRegex);
        for (var i = 0; i < matches.length; i++) {
            var path = matches[i].substr(2, matches[i].length - 4);
            var bindingValue = "";
            if (bindingInfo.dataContext != null
                && bindingInfo.dataContext.value != null
                && bindingInfo.dataContext.value[path] != null
                && bindingInfo.dataContext.value[path].value != null) {
                bindingValue = bindingInfo.dataContext.value[path].value;
            }
            text = text.replace(matches[i], bindingValue);
        }
        bindingInfo.node.nodeValue = text;
    };
    DataBinder.prototype.resolveBindings = function (bindingInfo) {
        for (var i = 0; i < bindingInfo.length; i++) {
            this.resolveBinding(bindingInfo[i]);
        }
    };
    DataBinder.prototype.resolveAllBindings = function () {
        for (var i = 0; i < this.nodeDataBindings.length; i++) {
            this.resolveBinding(this.nodeDataBindings[i]);
        }
    };
    DataBinder.prototype.releaseBinding = function (bindingInfo) {
        var observableProperty = bindingInfo.dataContext.value[bindingInfo.bindingPath];
        observableProperty.onValueChanged.unSubscribe(bindingInfo.updateCallback);
        for (var i = this.nodeDataBindings.length - 1; i--;) {
            if (this.nodeDataBindings[i] === bindingInfo) {
                this.nodeDataBindings.splice(i, 1);
            }
        }
    };
    DataBinder.prototype.releaseBindings = function (bindingInfo) {
        for (var i = 0; i < bindingInfo.length; i++) {
            this.releaseBinding(bindingInfo[i]);
        }
    };
    DataBinder.bindingRegex = /{{[a-zA-Z._0-9]+}}/g;
    return DataBinder;
})();
var NodeDataBindingInformation = (function () {
    function NodeDataBindingInformation() {
    }
    return NodeDataBindingInformation;
})();
var EventHandler = (function () {
    function EventHandler() {
        this.callbacks = new Array();
    }
    EventHandler.prototype.subscribe = function (callback) {
        this.callbacks.push(callback);
    };
    EventHandler.prototype.unSubscribe = function (callback) {
        var index = this.callbacks.indexOf(callback);
        this.callbacks = this.callbacks.splice(index, 1);
    };
    EventHandler.prototype.fire = function (arg) {
        for (var i = 0; i < this.callbacks.length; i++) {
            this.callbacks[i](arg);
        }
    };
    return EventHandler;
})();
//# sourceMappingURL=boink.js.map