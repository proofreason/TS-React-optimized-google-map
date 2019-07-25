"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var AsyncMounterContext_1 = require("../context/AsyncMounterContext");
var MapMounterContext_1 = require("../context/MapMounterContext");
var ObjectMounterContext_1 = require("../context/ObjectMounterContext");
var React = require("react");
var useContext = React.useContext, useEffect = React.useEffect;
var noMounterFound = function () {
    console.error('No map found to mount marker to. Did you wrap it with ObjectMounter or AsyncMounter?');
    return false;
};
var useAddMarkerToMap = function (props) {
    var mapContext = useContext(MapMounterContext_1.default)[0];
    var asyncMarkerArrayContext = useContext(AsyncMounterContext_1.default)[0];
    var markerArrayContext = useContext(ObjectMounterContext_1.MarkerArrayContext)[0];
    // async loading has preccedence
    if (ObjectMounterContext_1.objectMounterReady(asyncMarkerArrayContext)) {
        return AsyncMounterContext_1.useAddToAsyncMounter(asyncMarkerArrayContext, props);
    }
    if (ObjectMounterContext_1.objectMounterReady(markerArrayContext)) {
        return ObjectMounterContext_1.useAddToObjectMounter(markerArrayContext, props);
    }
    noMounterFound();
};
var useAddListenersToMarker = function (marker, listeners, changFlagged) {
    if (changFlagged === void 0) { changFlagged = null; }
    var activeListeners = [];
    var markerValid = marker !== null || undefined;
    var toWatch = changFlagged === null ? [markerValid, listeners] : [markerValid, changFlagged];
    useEffect(function () {
        if (markerValid) {
            listeners.map(function (_a) {
                var eventName = _a.eventName, listener = _a.listener;
                if (!listener) {
                    return null;
                }
                var enhancedListener = function (event) { return listener(marker, event); };
                // tslint:disable-next-line
                var addedListener = marker.addListener(eventName, enhancedListener);
                activeListeners.push(addedListener);
            });
        }
        return function () {
            activeListeners.map(function (listener) {
                listener.remove();
            });
        };
    }, toWatch);
};
exports.useAddListenersToMarker = useAddListenersToMarker;
var useUpdateOnPropsChange = function (props, marker) {
    var onClick = props.onClick, onMouseEnter = props.onMouseEnter, onMouseOut = props.onMouseOut, optimizations = props.optimizations, markerProps = __rest(props, ["onClick", "onMouseEnter", "onMouseOut", "optimizations"]);
    useEffect(function () {
        if (marker) {
            marker.setOptions(markerProps);
        }
    }, [markerProps, marker]);
};
var Marker = function (props) {
    var position = props.position;
    var boxPosition = position instanceof google.maps.LatLng
        ? position
        : new google.maps.LatLng(position.lat, position.lng);
    return (React.createElement(MarkerInner, __assign({}, props, { key: props.id }), props.children));
};
// change of id will generate new key and unmount the old one -> new id === new marker
var MarkerInner = function (props) {
    var addedMarker = useAddMarkerToMap(props);
    // this also handles the removal of listeners
    useAddListenersToMarker(addedMarker, [
        { eventName: 'click', listener: props.onClick },
        { eventName: 'mouseover', listener: props.onMouseEnter },
        { eventName: 'mouseout', listener: props.onMouseOut },
    ], props.optimizations && props.optimizations.listenersChanged);
    useUpdateOnPropsChange(props, addedMarker);
    return React.createElement(React.Fragment, null, props.children);
};
exports.default = Marker;
//# sourceMappingURL=Marker.js.map