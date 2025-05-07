import { Box, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Pupi_Card from "./Pupi_Card";
import PocketBase from "pocketbase";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Pupi_card_map_select from "../Pupi_card_map_select";


interface Lodging {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: number;
  available: string;
  coexistenceRules: string;
  owner: string;
  location: string;
  extras: string[];
  image: string;
}

interface Location {
  id: string;
  name: string;
  zoneId: string;
  latitude: string;
  longitude: string;
  description: string;
}

interface Pupi_card_gridProps {
  filters: {
    city: string;
    minPrice: number | null;
    maxPrice: number | null;
    type: string;
  };
}

export default function Pupi_card_grid({ filters }: Pupi_card_gridProps) {
  const [lodgings, setLodgings] = useState<Lodging[]>([]);
  const [locations, setLocations] = useState<Record<string, Location>>({});

  useEffect(() => {
    const abortController = new AbortController();

    const fetchLodgings = async () => {
      try {
        const pbInstance = new PocketBase("http://localhost:8090");
        const records = await pbInstance.collection("lodging").getFullList<Lodging>({
          sort: "-created",
        });
        if (!abortController.signal.aborted) {
        setLodgings(records);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
        console.error("Error fetching lodgings:", error);
       }
      }
    };

    const fetchLocations = async () => {
      try {
        const pbInstance = new PocketBase("http://localhost:8090");
        const locationRecords = await pbInstance.collection("location")
          .getFullList<Location>({
            sort: "-created",
          });
          if (!abortController.signal.aborted) {
        const locationDict: Record<string, Location> = {};
        locationRecords.forEach((location) => {
          locationDict[location.id] = location;
        });
        setLocations(locationDict);
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error("Error fetching locations:", error);
      }
    }
  };

    fetchLodgings();
    fetchLocations();

    return () => {
      abortController.abort(); //ejecutar la función de limpieza al desmontar el componente
    };
  }, []);

  const filteredLodgings = lodgings.filter((lodging) => {
    if (filters.city && locations[lodging.location]?.name !== filters.city) {
      return false;
    }
    if (filters.minPrice !== null && lodging.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== null && lodging.price > filters.maxPrice) {
      return false;
    }
    if (filters.type && lodging.type != filters.type) {
      return false;
    }
    return true;
  });

  return (
    <Grid container spacing={2} 
      sx={{
        display: "flex",
        width: "full",
        height: "auto",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "5px",
      }}
    >
      <Grid container spacing={2} sx={{ margin: "20px" }}>
        {filteredLodgings.map((lodging) => (
          <Grid item xs={10} sm={6} md={4} lg={4} key={lodging.id}>
            <Pupi_Card
              lodging={lodging}
              location={locations[lodging.location]}
            />
          </Grid>
        ))}
      </Grid>
      <Typography
        sx={{
          m: 1,
          fontSize: "2rem",
          fontFamily: "Barlow Condensed",
          fontWeight: "bold",
          color: "#865DFF",
        }}
      >
        COMPRUEBA LOS PUPILAJES DISPONIBLES{" "}
      </Typography>
      <Divider
        orientation="horizontal"
        sx={{
          border: "0.5px solid #865DFF",
          width: "70%  !important",
        }}
      />
      <Divider />
      <Grid
        style={{
          width: "100%",
          height: "450px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <MapContainer
          center={[13.794185, -88.89653] as L.LatLngExpression}
          zoom={9}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          {filteredLodgings.map((lodging) => {
            const location = locations[lodging.location];
            if (!location) return null;
            const position = [Number(location.latitude), Number(location.longitude)] as L.LatLngExpression;
            return (
              <Marker
                position={position}
                key={lodging.id}
                icon={L.icon({
                  iconUrl: markerIconPng,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowUrl: markerShadowPng,
                  shadowSize: [41, 41],
                })}
              >
                <Popup>
                  <Pupi_card_map_select
                    lodging={lodging}
                    location={locations[lodging.location]}
                  />
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </Grid>
    </Grid>
  );
}
