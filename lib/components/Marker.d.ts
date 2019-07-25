/// <reference types="googlemaps" />
import * as React from 'react';
declare type MarkerListenerFunction = (marker: google.maps.Marker, event: MouseEvent) => void;
interface Optimizations {
    listenersChanged?: boolean;
}
interface MarkerProps extends google.maps.MarkerOptions {
    [index: string]: any;
    children?: React.ReactNode;
    id: number;
    optimizations?: Optimizations;
    onClick?: MarkerListenerFunction;
    onMouseEnter?: MarkerListenerFunction;
    onMouseOut?: MarkerListenerFunction;
}
interface MarkerListener {
    eventName: google.maps.MarkerMouseEventNames;
    listener: MarkerListenerFunction;
}
declare const useAddListenersToMarker: (marker: google.maps.Marker, listeners: MarkerListener[], changFlagged?: boolean) => void;
declare const Marker: (props: MarkerProps) => JSX.Element;
export default Marker;
export { MarkerProps, useAddListenersToMarker };