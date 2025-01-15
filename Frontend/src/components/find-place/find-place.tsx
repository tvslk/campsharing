import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; 
import "leaflet/dist/leaflet.css";
import styles from "./find-place.module.scss";
import { Header } from "../header/header";
import { ButtonComponent } from "../button-component/button-component";
import customPin from "../../assets/icons/custom-pin.png"; 

interface Camp {
  osmId: number;
  name: string;
  lat: number;
  lon: number;
}

export const FindPlace = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 48.713, lng: 21.258 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);

  const navigate = useNavigate();

  
  const customIcon = L.icon({
    iconUrl: customPin, 
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32], 
  });

  useEffect(() => {
    const fetchCampsFromApi = async () => {
      try {
        const response = await fetch(
          "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/campsites"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Camps from API:", data);

        const formattedCamps = data.map((camp: Camp) => ({
          osmId: camp.osmId,
          name: camp.name || "Neznámy Kemp",
          lat: camp.lat,
          lon: camp.lon,
        }));
        setCamps(formattedCamps);
      } catch (error) {
        console.error("Error fetching camps:", error);
        alert("Nepodarilo sa načítať kempy.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampsFromApi();
  }, []);

  const handleCancel = () => {
    setMapCenter({ lat: 48.713, lng: 21.258 });
    setUserLocation(null);
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleSelectCamp = (camp: Camp) => {
    setSelectedCamp(camp);
  };

  const handleAddPlace = () => {
    if (!selectedCamp) {
      alert("Najprv vyberte kemp (kliknite na 'Vybrať miesto').");
      return;
    }

    localStorage.setItem("selectedPlace", JSON.stringify(selectedCamp));

    const selectedGadgetId = localStorage.getItem("selectedGadgetId");
    if (selectedGadgetId) {
      navigate(`/gadget-reservation/${selectedGadgetId}`);
    } else {
      navigate("/gadgets");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Header />
      </header>

      <MapContainer
        className={styles.mapContainer}
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={8}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {!loading &&
          camps.map((camp) => (
            <Marker
              key={camp.osmId}
              position={[camp.lat, camp.lon]}
              icon={customIcon} 
            >
              <Popup>
                <strong>{camp.name}</strong>
                <br />
                <button onClick={() => handleSelectCamp(camp)}>Vybrať miesto</button>
              </Popup>
            </Marker>
          ))}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={customIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>

      <div className={styles.actions}>
        <ButtonComponent
          cancelLabel="Zrušiť"
          submitLabel="Pridať miesto"
          onCancel={handleCancel}
          onSubmit={handleAddPlace}
        />
      </div>
    </div>
  );
};