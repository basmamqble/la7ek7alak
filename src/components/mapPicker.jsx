import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// مكون داخلي لتحديث مركز الخريطة تلقائياً عند تغير الإحداثيات
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 }); // تحريك سلس للخريطة مع زوم 14
    }
  }, [center, map]);
  return null;
}

export default function MapPicker({ lat = 31.5016, lng = 34.4668, onLocationSelect }) {
  const [position, setPosition] = useState([lat, lng]);

  // تحديث الموضع محلياً إذا تغيرت الـ props من الخارج (عند اختيار المدينة)
  useEffect(() => {
    if (lat && lng) {
      setPosition([lat, lng]);
    }
  }, [lat, lng]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        if (onLocationSelect) {
          onLocationSelect(lat, lng);
        }
      },
    });

    return position === null ? null : (
      <Marker position={position}></Marker>
    );
  }

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-200 z-0">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={position} />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}