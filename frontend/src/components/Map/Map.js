import React from 'react'
import {GoogleMap, withScriptjs, withGoogleMap,   Marker, InfoWindow } from "react-google-maps";

export default withScriptjs(withGoogleMap(function Map({children, coords, setCoords, setBounds, click, defaultZoom}) {
    return (
        <>
            <GoogleMap
                defaultCenter={coords} 
                center={coords}
                defaultZoom={defaultZoom} 
                onCenterChanged={setCoords}
                onBoundsChanged={setBounds}
                onClick={click}
                
            >
                {children}
            </GoogleMap>
        </>
    )
}))
