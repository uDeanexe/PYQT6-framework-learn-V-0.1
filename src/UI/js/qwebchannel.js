"use strict";

var QWebChannelMessageTypes = {
    signal: 1,
    propertyUpdate: 2,
    init: 3,
    idle: 4,
    debug: 5,
    invokeMethod: 6,
    connectToSignal: 7,
    disconnectFromSignal: 8,
    setProperty: 9,
    response: 10,
};

var QWebChannel = function(transport, initCallback)
{
    if (typeof transport !== "object" || typeof transport.send !== "function") {
        console.error("The QWebChannel expects a transport object with a send function and onmessage callback property." +
                      " Given is: transport: " + typeof(transport) + ", transport.send: " + typeof(transport.send));
        return;
    }

    var channel = this;
    this.transport = transport;

    this.send = function(data)
    {
        if (typeof(data) !== "string") {
            data = JSON.stringify(data);
        }
        channel.transport.send(data);
    }

    this.transport.onmessage = function(message)
    {
        var data = message.data;
        if (typeof data === "string") {
            data = JSON.parse(data);
        }
        switch (data.type) {
            case QWebChannelMessageTypes.signal:
                channel.handleSignal(data);
                break;
            case QWebChannelMessageTypes.response:
                channel.handleResponse(data);
                break;
            case QWebChannelMessageTypes.propertyUpdate:
                channel.handlePropertyUpdate(data);
                break;
            default:
                console.error("invalid message received:", data);
                break;
        }
    }

    this.execCallbacks = {};
    this.execId = 0;
    this.exec = function(data, callback)
    {
        if (!callback) {
            // if no callback is given, send directly
            channel.send(data);
            return;
        }
        if (channel.execId === Number.MAX_VALUE) {
            // wrap
            channel.execId = Number.MIN_VALUE;
        }
        if (data.hasOwnProperty("id")) {
            console.error("Cannot exec message with property id: " + JSON.stringify(data));
            return;
        }
        data.id = channel.execId++;
        channel.execCallbacks[data.id] = callback;
        channel.send(data);
    };

    this.objects = {};

    this.handleSignal = function(message)
    {
        var object = channel.objects[message.object];
        if (object) {
            object.signalEmitted(message.signal, message.args);
        } else {
            console.warn("Unhandled signal: " + message.object + "::" + message.signal);
        }
    }

    this.handleResponse = function(message)
    {
        if (!message.hasOwnProperty("id")) {
            console.error("Invalid response message received: ", JSON.stringify(message));
            return;
        }
        channel.execCallbacks[message.id](message.data);
        delete channel.execCallbacks[message.id];
    }

    this.handlePropertyUpdate = function(message)
    {
        for (var i in message.data) {
            var data = message.data[i];
            var object = channel.objects[data.object];
            if (object) {
                object.propertyUpdate(data.signals, data.properties);
            } else {
                console.warn("Unhandled property update: " + data.object + "::" + JSON.stringify(data));
            }
        }
        channel.exec({type: QWebChannelMessageTypes.idle});
    }

    this.debug = function(message)
    {
        channel.send({type: QWebChannelMessageTypes.debug, data: message});
    };

    channel.exec({type: QWebChannelMessageTypes.init}, function(data) {
        for (var objectName in data) {
            var object = new QObject(objectName, data[objectName], channel);
            channel.objects[objectName] = object;
        }
        if (initCallback) {
            initCallback(channel.objects);
        }
        channel.exec({type: QWebChannelMessageTypes.idle});
    });
};

function QObject(name, data, webChannel)
{
    this.__id__ = name;
    webChannel.objects[name] = this;

    // List of callbacks that get invoked upon signal emission
    this.__objectSignals__ = {};

    // Cache to store the value of properties on the Qt side
    this.__propertyCache__ = {};

    var object = this;

    // ----------------------------------------------------------------------

    this.unwrapQObject = function(response)
    {
        if (response instanceof Array) {
            // support list of objects
            var ret = new Array(response.length);
            for (var i = 0; i < response.length; ++i) {
                ret[i] = object.unwrapQObject(response[i]);
            }
            return ret;
        }
        if (!response
            || !response["__QObject*__"]
            || response.id === undefined) {
            return response;
        }

        var objectId = response.id;
        if (webChannel.objects[objectId])
            return webChannel.objects[objectId];

        if (!response.data) {
            console.error("Cannot unwrap unknown QObject " + objectId + " without data.");
            return;
        }

        var qObject = new QObject( objectId, response.data, webChannel );
        qObject.destroyed.connect(function() {
            if (webChannel.objects[objectId] === qObject) {
                delete webChannel.objects[objectId];
                // reset the now deleted QObject to an empty {} object
                // just assigning {} though would not have the desired effect, but the
                // below also ensures all external references will see the empty map
                // NOTE: this detour is necessary to workaround QTBUG-40021
                var propertyNames = [];
                for (var propertyName in qObject) {
                    propertyNames.push(propertyName);
                }
                for (var idx in propertyNames) {
                    delete qObject[propertyNames[idx]];
                }
            }
        });
        // here we are already initialized, and thus must directly unwrap the properties
        qObject.unwrapProperties();
        return qObject;
    };

    this.unwrapProperties = function()
    {
        for (var propertyIdx in object.__propertyCache__) {
            object.__propertyCache__[propertyIdx] = object.unwrapQObject(object.__propertyCache__[propertyIdx]);
        }
    }

    this.propertyUpdate = function(signals, propertyMap)
    {
        // update property cache
        for (var propertyIndex in propertyMap) {
            var propertyValue = propertyMap[propertyIndex];
            object.__propertyCache__[propertyIndex] = propertyValue;
        }

        for (var signalName in signals) {
            var signalIndex = signals[signalName];
            if (signalIndex) {
                object.__objectSignals__[signalIndex] = object.__objectSignals__[signalName];
                delete object.__objectSignals__[signalName];
            }
        }

        object.unwrapProperties();
    }

    this.signalEmitted = function(signalName, signalArgs)
    {
        var callbacks = object.__objectSignals__[signalName];
        if (callbacks) {
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i].apply(object, signalArgs);
            }
        }
    }

    this.connect = function(signalName, signalIndex, callback)
    {
        if (typeof(callback) !== "function") {
            console.error("Bad callback given to connect to signal " + signalName);
            return;
        }

        if (!object.__objectSignals__[signalIndex]) {
            object.__objectSignals__[signalIndex] = [];
        }
        object.__objectSignals__[signalIndex].push(callback);

        if (object.__objectSignals__[signalIndex].length == 1) {
            webChannel.exec({
                type: QWebChannelMessageTypes.connectToSignal,
                object: object.__id__,
                signal: signalIndex
            });
        }
    }

    this.disconnect = function(signalName, signalIndex, callback)
    {
        if (typeof(callback) !== "function") {
            console.error("Bad callback given to disconnect from signal " + signalName);
            return;
        }
        var callbacks = object.__objectSignals__[signalIndex];
        if (callbacks) {
            var idx = callbacks.indexOf(callback);
            if (idx != -1) {
                callbacks.splice(idx, 1);
                if (callbacks.length === 0) {
                    webChannel.exec({
                        type: QWebChannelMessageTypes.disconnectFromSignal,
                        object: object.__id__,
                        signal: signalIndex
                    });
                }
            }
        }
    }

    function addSignal(signalData, isPropertyNotifySignal)
    {
        var signalName = signalData[0];
        var signalIndex = signalData[1];
        object[signalName] = {
            connect: function(callback) { object.connect(signalName, signalIndex, callback); },
            disconnect: function(callback) { object.disconnect(signalName, signalIndex, callback); }
        };
        if (!isPropertyNotifySignal && signalData[2] === true) {
            // this signal is public, so add it to the QMetaObject of this object
            object[signalName].connect(function() {
                // Property getter signals are nameless and private, hence no signal emission
                if (signalName !== "") {
                    // QWebChannel.__objectSignals__[object].push([signalName, arguments]); 
                    // Note: Simplified logic here for typical use cases
                }
            });
        }
    }

    function addMethod(methodData)
    {
        var methodName = methodData[0];
        var methodIdx = methodData[1];
        object[methodName] = function() {
            var args = [];
            var callback;
            for (var i = 0; i < arguments.length; ++i) {
                var arg = arguments[i];
                if (typeof arg === "function")
                    callback = arg;
                else
                    args.push(object.unwrapQObject(arg));
            }

            webChannel.exec({
                "type": QWebChannelMessageTypes.invokeMethod,
                "object": object.__id__,
                "method": methodIdx,
                "args": args
            }, function(response) {
                if (response !== undefined) {
                    var result = object.unwrapQObject(response);
                    if (callback) {
                        (callback)(result);
                    }
                }
            });
        };
    }

    function bindGetterSetter(propertyInfo)
    {
        var propertyIndex = propertyInfo[0];
        var propertyName = propertyInfo[1];
        var notifySignalData = propertyInfo[2];

        // initialize property cache with current value
        object.__propertyCache__[propertyIndex] = propertyInfo[3];

        if (notifySignalData) {
            if (notifySignalData[0] === 1) {
                addSignal(notifySignalData, true);
            }
        }

        Object.defineProperty(object, propertyName, {
            configurable: true,
            get: function () {
                var val = object.__propertyCache__[propertyIndex];
                if (val === undefined) {
                    console.warn("Undefined value in property cache for property \"" + propertyName + "\" in object " + object.id);
                }
                return val;
            },
            set: function(value) {
                if (value === undefined) {
                    console.warn("Property setter for " + propertyName + " called with undefined value!");
                    return;
                }
                object.__propertyCache__[propertyIndex] = value;
                webChannel.exec({
                    "type": QWebChannelMessageTypes.setProperty,
                    "object": object.__id__,
                    "property": propertyIndex,
                    "value": value
                });
            }
        });
    }

    data.methods.forEach(addMethod);
    data.properties.forEach(bindGetterSetter);
    data.signals.forEach(function(signal) { addSignal(signal, false); });

    for (var propName in data.enums) {
        object[propName] = data.enums[propName];
    }
}

QObject.prototype.toString = function()
{
    return "[object QObject(" + this.__id__ + ")]";
}

QObject.prototype.destroyed = function() {
    // placeholder signal
}

QObject.prototype.destroyed.connect = function(callback) {
    if (typeof callback !== "function") {
        console.error("Bad callback given to connect to signal destroyed");
        return;
    }
    var object = this;
    if (!object.__objectSignals__["destroyed"]) {
        object.__objectSignals__["destroyed"] = [];
    }
    object.__objectSignals__["destroyed"].push(callback);
}

QObject.prototype.destroyed.disconnect = function(callback) {
    if (typeof callback !== "function") {
        console.error("Bad callback given to disconnect from signal destroyed");
        return;
    }
    var object = this;
    var callbacks = object.__objectSignals__["destroyed"];
    if (callbacks) {
        var idx = callbacks.indexOf(callback);
        if (idx != -1) {
            callbacks.splice(idx, 1);
        }
    }
}