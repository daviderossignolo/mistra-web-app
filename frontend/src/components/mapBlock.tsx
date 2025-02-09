import type React from "react";
import {
	GoogleMap,
	InfoWindow,
	LoadScript,
	Marker,
} from "@react-google-maps/api";
import { useState } from "react";

type MapBlockProps = {
	latitude: number;
	longitude: number;
};

const containerStyle = {
	width: "100%",
	height: "400px",
};

const MapBlock: React.FC<MapBlockProps> = ({ latitude, longitude }) => {
	const [selectedMarker, setSelectedMarker] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	const center = {
		lat: latitude,
		lng: longitude,
	};
	const apiKey = process.env.REACT_APP_MAPS_API_KEY;

	if (!apiKey) {
		return <p>Error: Google Maps API key is not provided.</p>;
	}

	const handleMarkerClick = () => {
		setSelectedMarker(center);
	};

	const closeInfoWindow = () => {
		setSelectedMarker(null);
	};

	return (
		<div className="flex items-start gap-5 m-5 p-5 rounded-lg">
			<div className="flex-3 flex flex-col items-center w-full">
				<div className="bg-navbar-hover text-white text-center p-2 rounded-t-lg w-full">
					<h3 className="m-0 font-bold" id="mapTitle">
						Il Centro MISTRA si trova qui
					</h3>
				</div>
				<LoadScript googleMapsApiKey={apiKey}>
					<GoogleMap
						mapContainerStyle={containerStyle}
						center={center}
						zoom={15}
						aria-describedby="mapTitle"
						aria-label="Mappa interattiva del Centro MISTRA"
					>
						<Marker
							position={center}
							onClick={handleMarkerClick}
							aria-label="Posizione del Centro MISTRA"
						/>

						{selectedMarker && (
							<InfoWindow
								position={selectedMarker}
								onCloseClick={closeInfoWindow}
							>
								<div>
									<p className="font-bold">AOUI Verona</p>
									<a
										href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.lat},${selectedMarker.lng}`}
										target="_blank"
										rel="noopener noreferrer"
										style={{ color: "blue", textDecoration: "underline" }}
										aria-label={`Indicazioni stradali per AOUI Verona da ${selectedMarker.lat}, ${selectedMarker.lng} (si apre in una nuova scheda)`}
									>
										Come arrivare
									</a>
								</div>
							</InfoWindow>
						)}
					</GoogleMap>
				</LoadScript>
			</div>
		</div>
	);
};

export default MapBlock;