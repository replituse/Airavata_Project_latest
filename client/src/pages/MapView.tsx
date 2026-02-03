import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useDams } from "@/hooks/use-dams";
import { Icon } from "leaflet";
// Leaflet CSS is imported in index.css

// Fix for default marker icon in React Leaflet
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView() {
  const { data: dams, isLoading } = useDams();

  const centerPosition: [number, number] = [20.5937, 78.9629]; // India Center

  return (
    <div className="h-screen w-full relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground font-medium">Loading geospatial data...</p>
          </div>
        </div>
      )}
      
      <div className="absolute top-6 left-16 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg border">
        <h2 className="font-bold text-lg">Dam Monitoring Network</h2>
        <p className="text-xs text-muted-foreground">Live water levels & status</p>
      </div>

      <MapContainer 
        center={centerPosition} 
        zoom={5} 
        scrollWheelZoom={true} 
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {dams?.map((dam) => (
          <Marker 
            key={dam.id} 
            position={[dam.lat, dam.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <h3 className="font-bold text-base mb-1">{dam.name}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`font-semibold ${
                      dam.status === 'Critical' ? 'text-red-600' :
                      dam.status === 'Alert' ? 'text-amber-600' : 'text-green-600'
                    }`}>{dam.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span>{dam.capacity} TMC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Level:</span>
                    <span>{dam.waterLevel}m</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
