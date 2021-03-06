import { MarkerMounterContext, MarkerMounterContextType } from '@context/ObjectMounterContext';
import { addListenersToMarker } from '@lib/MapUtils';
import { MarkerListener } from '@src_types/mapTypes';
import { makeRe } from 'minimatch';
import * as React from 'react';
import Marker, { MarkerProps } from './Marker';
const { Children, useContext, useState, useEffect } = React;

type ChildrenType =
    | React.ComponentElement<MarkerProps, null>[]
    | React.ComponentElement<MarkerProps, null>;
interface MarkerBatchProps {
    children: ChildrenType;
}

type MarkersChildrenState = [
    React.ReactNode,
    React.Dispatch<React.SetStateAction<React.ReactNode>>,
];

type PrevListenersState = [
    google.maps.MapsEventListener[],
    React.Dispatch<React.SetStateAction<google.maps.MapsEventListener[]>>,
];

type PrevMarkerPropsState = [MarkerProps[], React.Dispatch<React.SetStateAction<MarkerProps[]>>];

const removeDeprecated = (
    markersProps: MarkerProps[],
    listeners: google.maps.MapsEventListener[],
    mounterContext: MarkerMounterContextType,
) => {
    const [mounter] = mounterContext;
    markersProps.map((markerProps) => {
        const { isUnmounted } = mounter.stateObject;
        !isUnmounted && mounter.removeObject(markerProps.id);
    });
    listeners.map((listener) => {
        listener.remove();
    });
};

const addMarkersToMounter = (
    markersProps: MarkerProps[],
    markerListenerFncs: MarkerListener[][],
    mounterContext: MarkerMounterContextType,
): [google.maps.Marker[], google.maps.MapsEventListener[]] => {
    const [mounter] = mounterContext;
    const listeners: google.maps.MapsEventListener[] = [];
    const markers = markersProps.map((markerProps) => {
        const marker = mounter.addObject(markerProps, markerProps.id);
        listeners.concat(addListenersToMarker(markerListenerFncs[markerProps.id], marker));
        return marker;
    });
    return [markers, listeners];
};

const getPropertiesFromChildren = (
    children: ChildrenType,
): [MarkerProps[], MarkerListener[][], React.ReactNode[]] => {
    const markerProps: MarkerProps[] = [];
    const markerListenerFncs: MarkerListener[][] = [];
    const markersChildren: React.ReactNode[] = [];
    Children.map(children, (child) => {
        const { onClick, onMouseEnter, onMouseOut, id, children: markerChildren } = child.props;
        markerProps[id] = child.props;
        markerListenerFncs[id] = [
            { eventName: 'click', listener: onClick },
            { eventName: 'mouseover', listener: onMouseEnter },
            { eventName: 'mouseout', listener: onMouseOut },
        ];
        markersChildren.push(markerChildren);
    });
    return [markerProps, markerListenerFncs, markersChildren];
};

const useUpdateFromChildren = (
    children: ChildrenType,
    markersChildrenState: MarkersChildrenState,
    prevMarkerPropsState: PrevMarkerPropsState,
    prevListenersState: PrevListenersState,
    mounterContext: MarkerMounterContextType,
) => {
    const [mounterContextState] = mounterContext;
    useEffect(() => {
        const [prevMarkerProps, setPrevMarkerProps] = prevMarkerPropsState;
        const [prevListeners, setPrevListeners] = prevListenersState;
        const [markersChildren, setMarkersChildren] = markersChildrenState;
        if (
            !children ||
            !mounterContext ||
            !mounterContextState.addObject ||
            !mounterContextState.removeObject
        ) {
            return;
        }
        const [markerProps, markerListenerFncs, newChildren] = getPropertiesFromChildren(children);
        const [markers, listeners] = addMarkersToMounter(
            markerProps,
            markerListenerFncs,
            mounterContext,
        );
        setMarkersChildren(newChildren);
        setPrevMarkerProps(markerProps);
        setPrevListeners(listeners);
        return () => {
            removeDeprecated(markerProps, prevListeners, mounterContext);
        };
    }, [children, mounterContextState]);
};

const MarkerBatch = ({ children }: MarkerBatchProps) => {
    const mounterContext = useContext(MarkerMounterContext);
    const prevMarkerPropsState: PrevMarkerPropsState = useState([]);
    const prevListenersState: PrevListenersState = useState([]);
    const childrenState: MarkersChildrenState = useState([]);
    const [markersChildren] = childrenState;

    useUpdateFromChildren(
        children,
        childrenState,
        prevMarkerPropsState,
        prevListenersState,
        mounterContext,
    );

    return <>{markersChildren}</>;
};

export default MarkerBatch;
