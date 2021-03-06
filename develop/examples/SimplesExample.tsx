import GoogleMapsMounter from '@components/GoogleMapsMounter';
import MarkerMounter from '@components/googleMapsMounters/MarkerMounter';
import GoogleScriptMounter from '@components/GoogleScriptMounter';
import InfoBox from '@components/InfoBox';
import MapControll from '@components/MapControll';
import Marker from '@components/Marker';
import MarkerBatch from '@components/MarkerBatch';
import OptimizedMarkerClusterer from '@components/MarkerClusterer';
import MapMounterContext from '@context/MapMounterContext';
import { CZECH_REPUBLIC_LAT, CZECH_REPUBLIC_LONG } from '@develop_lib/constants';
import { getRandomLocations } from '@develop_lib/markerUtils';
import * as React from 'react';
import MarkerDeployer from '../components/testing/MarkerDeployer';
const { useState } = React;

type MapInitializerProps = {};

const GOOGLE_API_URL = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
const prevAndSelectedId: number[] = [null];
const prevSelectedId: number = null;

export const SimpleExampleMapInitializer = () => {
    const [isScriptLoaded, setScriptLoaded] = useState(false);
    const [displayMarkers, setDisplayMarkers] = useState(true);
    const [mapMounterContext, setMapMounterContex] = React.useContext(MapMounterContext);

    const setScriptIsLoaded = () => setScriptLoaded(true);

    const mapWrapper = <div id={'map-mounter'} style={{ width: '800px', height: '500px' }} />;

    const toggleDisplayMarkers = () => {
        displayMarkers ? setDisplayMarkers(false) : setDisplayMarkers(true);
    };
    const testPosition = getRandomLocations(1)[0];
    const testingMarkerId = 11;

    return (
        <GoogleScriptMounter scriptUrl={GOOGLE_API_URL} onScriptLoad={setScriptIsLoaded}>
            {isScriptLoaded && (
                <GoogleMapsMounter
                    mapElement={mapWrapper}
                    center={{ lat: CZECH_REPUBLIC_LAT, lng: CZECH_REPUBLIC_LONG }}
                    withMounter={true}
                >
                    <Marker
                        key={1}
                        id={1}
                        markerOptions={{
                            // google maps marker options
                            position: testPosition,
                            optimized: true,
                        }}
                    />
                </GoogleMapsMounter>
            )}
        </GoogleScriptMounter>
    );
};
