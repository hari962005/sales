import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Loader2 } from 'lucide-react';

// Fix leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationUpdater({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);
  return null;
}

export default function LiveTracking() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setTimeout(() => {
        setLocationError('Geolocation is not supported by your browser.');
        setUserLocation([40.715, -74.0]);
        setLoading(false);
      }, 0);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setLoading(false);

        // Reverse geocode user location
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`)
          .then((res) => res.json())
          .then((data) => {
            if (data && data.display_name) {
              setAddress(data.display_name);
            }
          })
          .catch(() => {
            // Ignore geocoding failure; coordinates will still display
          });
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationError('Unable to access current location. Using fallback location.');
        setUserLocation([40.715, -74.0]);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const activeReps = userLocation
    ? [
        {
          id: '2',
          lat: userLocation[0] + 0.005,
          lng: userLocation[1] + 0.006,
          name: 'John Doe',
          status: 'Visiting Customer',
          lastUpdate: '2 mins ago',
        },
        {
          id: '3',
          lat: userLocation[0] - 0.004,
          lng: userLocation[1] - 0.005,
          name: 'Jane Smith',
          status: 'In Transit',
          lastUpdate: '5 mins ago',
        },
      ]
    : [];

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] flex flex-col space-y-4 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Live Field Tracking</h1>
        <p className="text-slate-500 dark:text-slate-400">Monitor your sales representatives in real-time</p>
        
        {/* Current Location display below map header */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-sm">
            <MapPin className="w-4 h-4 text-primary-500 text-blue-500 shrink-0" />
            {loading ? (
              <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Detecting current location...
              </span>
            ) : userLocation ? (
              <span>
                <span className="font-semibold text-slate-900 dark:text-white">Current Coordinates:</span>{' '}
                {userLocation[0].toFixed(5)}, {userLocation[1].toFixed(5)}
                {address && (
                  <span className="text-slate-500 dark:text-slate-400 text-xs block md:inline md:ml-2">
                    ({address.split(',').slice(0, 3).join(', ')})
                  </span>
                )}
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">Location unavailable</span>
            )}
          </div>
          {locationError && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">{locationError}</span>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden relative z-0">
        {loading ? (
          <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
            <p className="text-slate-700 dark:text-slate-200 font-medium">Acquiring your location...</p>
            <p className="text-xs text-slate-400 mt-1">Please allow location access if prompted</p>
          </div>
        ) : (
          userLocation && (
            <MapContainer
              key={`${userLocation[0]}-${userLocation[1]}`}
              center={userLocation}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
            >
              <LocationUpdater position={userLocation} />
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={userLocation}>
                <Popup>
                  <div className="p-2 space-y-1">
                    <h3 className="font-bold text-slate-900">You are here</h3>
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold">Coordinates:</span> {userLocation[0].toFixed(5)}, {userLocation[1].toFixed(5)}
                    </p>
                    {address ? (
                      <p className="text-xs text-slate-600">
                        <span className="font-semibold">Address:</span> {address}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Fetching address...</p>
                    )}
                  </div>
                </Popup>
              </Marker>

              {activeReps.map((rep) => (
                <Marker key={rep.id} position={[rep.lat, rep.lng]}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-slate-900">{rep.name}</h3>
                      <p className="text-sm text-slate-600 mb-2">{rep.status}</p>
                      <p className="text-xs text-slate-400">Updated: {rep.lastUpdate}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )
        )}
      </div>
    </div>
  );
}
