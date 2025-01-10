import type React from "react"; 
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { jsonToMarkdown } from "../utils";

type MapBlockProps = {
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  cap: string;
  description: {
    level: number;
    type: string;
    children: { type: string; text: string }[];
  }[];
};

const containerStyle = {
  width: "50%",
  height: "400px",
};

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    margin: "20px",
    padding: "20px",
    paddingLeft: "100px",
    paddingRight: "100px",
    borderRadius: "8px",
  },
  textSection: {
    flex: 2,
    // padding: "10px",
    // fontSize: "16px",
    // lineHeight: "1.5",
    // color: "#333",
  },
  mapSection: {
    flex: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  mapHeader: {
    backgroundColor: "#003449", // Colore blu scuro
    color: "#fff",
    textAlign: "center",
    padding: "10px",
    borderRadius: "8px 8px 0 0",
    width: "50%",
  },
};

const MapBlock: React.FC<MapBlockProps> = ({ latitude, longitude, description }) => {
  const center = {
    lat: latitude,
    lng: longitude,
  };
  const content = jsonToMarkdown(description);
  const apiKey = process.env.REACT_APP_MAPS_API_KEY;

  if (!apiKey) {
    return <p>Error: Google Maps API key is not provided.</p>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.textSection}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
      <div style={styles.mapSection as React.CSSProperties}>
        <div style={styles.mapHeader as React.CSSProperties}>Il Centro MISTRA si trova qui</div>
        <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
      </div>
    </div>
  );
};



export default MapBlock;
