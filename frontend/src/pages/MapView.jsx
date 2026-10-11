import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Building2, HeartHandshake, Stethoscope, Phone, Navigation, Filter, Compass, CheckCircle, Navigation2, Search, ExternalLink } from 'lucide-react';
import L from 'leaflet';

// Custom Leaflet Marker Icons
const createCustomIcon = (color, isUser = false) => {
  return new L.DivIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${color}; width: ${isUser ? '32px' : '26px'}; height: ${isUser ? '32px' : '26px'}; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; text-align: center;">${isUser ? '📍' : ''}</div>`,
    iconSize: [isUser ? 32 : 26, isUser ? 32 : 26],
    iconAnchor: [isUser ? 16 : 13, isUser ? 16 : 13],
  });
};

const userLiveIcon = createCustomIcon('#3b82f6', true); // Bright Blue pulse for User
const pharmacyIcon = createCustomIcon('#2563eb');       // Blue for Pharmacies
const ngoIcon = createCustomIcon('#059669');            // Emerald for NGOs
const hospitalIcon = createCustomIcon('#dc2626');       // Red for Hospitals

// Map recenter controller
const MapRecenter = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 13);
  }, [lat, lon]);
  return null;
};

// Master Telangana / Greater Hyderabad & Outskirts Places Database
const HYDERABAD_PLACES = [
  // --- NGOS & CHARITY TRUSTS ---
  {
    id: 'ngo-hyd-1',
    name: 'Helping Hands Foundation NGO',
    type: 'NGO',
    address: 'H.No 12-2-823, Mehdipatnam X Roads, Hyderabad, Telangana - 500028',
    phone: '+91 98490 12345',
    latitude: 17.3916,
    longitude: 78.4428,
    contactPerson: 'Syed Hafiz (Relief Coordinator)',
  },
  {
    id: 'ngo-hyd-2',
    name: 'Robin Hood Army NGO (Hyderabad)',
    type: 'NGO',
    address: 'Road No. 12, Banjara Hills, Hyderabad, Telangana - 500034',
    phone: '+91 97012 34567',
    latitude: 17.4156,
    longitude: 78.4347,
    contactPerson: 'Priya Sharma (Dispatches)',
  },
  {
    id: 'ngo-hyd-3',
    name: 'Akshaya Healthcare Trust NGO',
    type: 'NGO',
    address: 'Abids Circle, Tilak Road, Hyderabad, Telangana - 500001',
    phone: '+91 91234 56789',
    latitude: 17.3888,
    longitude: 78.4735,
    contactPerson: 'Ramesh Varma',
  },
  {
    id: 'ngo-hyd-4',
    name: 'Seva Bharathi Medical Relief NGO',
    type: 'NGO',
    address: 'Kachiguda Railway Station Road, Hyderabad, Telangana - 500027',
    phone: '+91 94400 88123',
    latitude: 17.3892,
    longitude: 78.4981,
    contactPerson: 'Anand Kumar',
  },
  {
    id: 'ngo-hyd-5',
    name: 'Seruds Charity Foundation NGO',
    type: 'NGO',
    address: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana - 500033',
    phone: '+91 98491 99882',
    latitude: 17.4325,
    longitude: 78.4065,
    contactPerson: 'G. Mallikarjuna',
  },
  {
    id: 'ngo-hyd-6',
    name: 'Sanjeevani Charitable Trust NGO',
    type: 'NGO',
    address: 'Elephant House, Ameerpet, Hyderabad, Telangana - 500016',
    phone: '+91 93910 44556',
    latitude: 17.4368,
    longitude: 78.4485,
    contactPerson: 'Dr. Sunita Rao',
  },
  {
    id: 'ngo-hyd-7',
    name: 'Indian Red Cross Society (Telangana)',
    type: 'NGO',
    address: 'Red Cross Bhavan, Lakdikapul, Hyderabad, Telangana - 500004',
    phone: '+91 40 2339 3123',
    latitude: 17.4042,
    longitude: 78.4631,
    contactPerson: 'K. Satyanarayana',
  },
  {
    id: 'ngo-hyd-8',
    name: 'Rotary Healthcare Foundation NGO',
    type: 'NGO',
    address: 'Financial District, Nanakramguda, Gachibowli, Hyderabad - 500032',
    phone: '+91 40 6789 1234',
    latitude: 17.4185,
    longitude: 78.3498,
    contactPerson: 'Vikram Mehta',
  },
  {
    id: 'ngo-hyd-9',
    name: 'Lions Club International Relief',
    type: 'NGO',
    address: 'SP Road, Paradise Circle, Secunderabad, Telangana - 500003',
    phone: '+91 40 2781 9900',
    latitude: 17.4412,
    longitude: 78.4879,
    contactPerson: 'B. Rajeshwar',
  },
  {
    id: 'ngo-hyd-10',
    name: 'Asha Kendra Medical Charity Trust',
    type: 'NGO',
    address: 'KPHB Colony Phase 1, Kukatpally, Hyderabad, Telangana - 500072',
    phone: '+91 98855 11223',
    latitude: 17.4851,
    longitude: 78.4094,
    contactPerson: 'Sister Mary Joseph',
  },
  {
    id: 'ngo-hyd-11',
    name: 'Spoorthi Foundation Relief NGO',
    type: 'NGO',
    address: 'Near Dilsukhnagar Metro Station, Hyderabad, Telangana - 500060',
    phone: '+91 97000 66778',
    latitude: 17.3688,
    longitude: 78.5247,
    contactPerson: 'M. Srinivas',
  },
  {
    id: 'ngo-hyd-12',
    name: 'Care & Compassion Relief Trust',
    type: 'NGO',
    address: 'Moghalpura, Near Charminar, Hyderabad, Telangana - 500002',
    phone: '+91 98480 33445',
    latitude: 17.3616,
    longitude: 78.4747,
    contactPerson: 'Mohammed Ali',
  },
  {
    id: 'ngo-hyd-13',
    name: 'Ghatkesar Healthcare Charity Foundation',
    type: 'NGO',
    address: 'Main Road, Ghatkesar Outskirts, Hyderabad, Telangana - 501301',
    phone: '+91 98492 88100',
    latitude: 17.4483,
    longitude: 78.6834,
    contactPerson: 'K. Narsimha Reddy',
  },
  {
    id: 'ngo-hyd-13b',
    name: 'Medipally Community Health Relief NGO',
    type: 'NGO',
    address: 'Warangal Highway, Medipally, Hyderabad, Telangana - 500098',
    phone: '+91 98491 55667',
    latitude: 17.4124,
    longitude: 78.5982,
    contactPerson: 'P. Narsing Rao',
  },
  {
    id: 'ngo-hyd-13c',
    name: 'Narapally Medical Charity Trust NGO',
    type: 'NGO',
    address: 'Narapally Chowrastha, Ghatkesar Route, Hyderabad, Telangana - 500088',
    phone: '+91 97000 88991',
    latitude: 17.4261,
    longitude: 78.6315,
    contactPerson: 'M. Sridhar',
  },
  {
    id: 'ngo-hyd-14',
    name: 'Medchal Medical Relief Trust NGO',
    type: 'NGO',
    address: 'Medchal-Malkajgiri Highway Center, Telangana - 501401',
    phone: '+91 97011 55443',
    latitude: 17.6294,
    longitude: 78.4812,
    contactPerson: 'S. Vijay Kumar',
  },
  {
    id: 'ngo-hyd-15',
    name: 'Kompally Community Welfare Trust',
    type: 'NGO',
    address: 'NH 44, Kompally X Roads, Secunderabad/Hyd Outskirts - 500100',
    phone: '+91 99490 33221',
    latitude: 17.5385,
    longitude: 78.4862,
    contactPerson: 'Dr. Sunita Varma',
  },
  {
    id: 'ngo-hyd-16',
    name: 'Uppal Rural Relief Foundation',
    type: 'NGO',
    address: 'Uppal Metro Station Hub, Hyderabad, Telangana - 500039',
    phone: '+91 91234 44556',
    latitude: 17.3984,
    longitude: 78.5582,
    contactPerson: 'P. Ravinder',
  },
  {
    id: 'ngo-hyd-17',
    name: 'Shamshabad ORR Outer Relief Charity',
    type: 'NGO',
    address: 'ORR Interchange 16, Shamshabad, Hyderabad Outskirts - 501218',
    phone: '+91 98499 77881',
    latitude: 17.2543,
    longitude: 78.4281,
    contactPerson: 'Capt. S. Shekhar',
  },
  {
    id: 'ngo-hyd-18',
    name: 'Patancheru Industrial Worker Welfare NGO',
    type: 'NGO',
    address: 'ORR Junction 3, Patancheru Industrial Zone, Hyderabad - 502319',
    phone: '+91 94401 22334',
    latitude: 17.5312,
    longitude: 78.2634,
    contactPerson: 'R. Koteshwar',
  },

  // --- PHARMACIES ---
  {
    id: 'ph-hyd-1',
    name: 'Apollo Pharmacy 24x7',
    type: 'PHARMACY',
    address: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana - 500033',
    phone: '+91 40 2360 7777',
    latitude: 17.4319,
    longitude: 78.4071,
    licenseNo: 'TS-HYD-PH-2026-8801',
  },
  {
    id: 'ph-hyd-2',
    name: 'MedPlus Partner Pharmacy',
    type: 'PHARMACY',
    address: 'H.No 4-1-882, Abids Commercial Center, Hyderabad, Telangana - 500001',
    phone: '+91 40 2473 1122',
    latitude: 17.3872,
    longitude: 78.4741,
    licenseNo: 'TS-HYD-PH-2026-4412',
  },
  {
    id: 'ph-hyd-3',
    name: 'Care Pharmacy & Surgical Store',
    type: 'PHARMACY',
    address: 'Minister Road, Secunderabad, Telangana - 500003',
    phone: '+91 40 2780 4455',
    latitude: 17.4385,
    longitude: 78.4872,
    licenseNo: 'TS-HYD-PH-2026-9931',
  },
  {
    id: 'ph-hyd-4',
    name: 'Frank Ross Pharmacy',
    type: 'PHARMACY',
    address: 'Near Metro Station, Ameerpet, Hyderabad, Telangana - 500016',
    phone: '+91 40 6610 8899',
    latitude: 17.4375,
    longitude: 78.4482,
    licenseNo: 'TS-HYD-PH-2026-1029',
  },
  {
    id: 'ph-hyd-5',
    name: 'Apollo Pharmacy Ghatkesar',
    type: 'PHARMACY',
    address: 'Main Highway Road, Ghatkesar, Telangana - 501301',
    phone: '+91 40 2712 9900',
    latitude: 17.4472,
    longitude: 78.6811,
    licenseNo: 'TS-HYD-PH-2026-5510',
  },
  {
    id: 'ph-hyd-5b',
    name: 'Apollo Pharmacy Medipally',
    type: 'PHARMACY',
    address: 'Near Medipally Bus Stop, Warangal Highway - 500098',
    phone: '+91 40 2714 8822',
    latitude: 17.4131,
    longitude: 78.5991,
    licenseNo: 'TS-HYD-PH-2026-6641',
  },
  {
    id: 'ph-hyd-5c',
    name: 'MedPlus Pharmacy Narapally',
    type: 'PHARMACY',
    address: 'Warangal Highway, Narapally, Hyderabad - 500088',
    phone: '+91 40 2715 3300',
    latitude: 17.4268,
    longitude: 78.6324,
    licenseNo: 'TS-HYD-PH-2026-7712',
  },
  {
    id: 'ph-hyd-6',
    name: 'MedPlus Pharmacy Medchal',
    type: 'PHARMACY',
    address: 'Medchal Bus Station Circle, Medchal-Malkajgiri - 501401',
    phone: '+91 40 2790 3344',
    latitude: 17.6281,
    longitude: 78.4805,
    licenseNo: 'TS-HYD-PH-2026-7781',
  },
  {
    id: 'ph-hyd-7',
    name: 'Apollo Pharmacy Kompally',
    type: 'PHARMACY',
    address: 'Near Big Bazaar, Kompally, Secunderabad - 500100',
    phone: '+91 40 2796 1122',
    latitude: 17.5372,
    longitude: 78.4851,
    licenseNo: 'TS-HYD-PH-2026-3390',
  },
  {
    id: 'ph-hyd-8',
    name: 'Apollo Pharmacy Uppal',
    type: 'PHARMACY',
    address: 'Warangal Highway Junction, Uppal, Hyderabad - 500039',
    phone: '+91 40 2720 4455',
    latitude: 17.3992,
    longitude: 78.5591,
    licenseNo: 'TS-HYD-PH-2026-4420',
  },

  // --- HOSPITALS ---
  {
    id: 'hosp-hyd-1',
    name: 'Apollo Hospitals - Jubilee Hills',
    type: 'HOSPITAL',
    address: 'Road No. 92, Jubilee Hills, Hyderabad, Telangana - 500033',
    phone: '+91 40 2360 7777',
    latitude: 17.4261,
    longitude: 78.4116,
    emergencyDesk: 'ICU Requisition Wing - Block B',
  },
  
    {
  id: 'hosp-uppal-tx',
  name: 'TX Hospitals, Uppal',
  type: 'HOSPITAL',
  address: '2-6-71, Bharath Nagar Colony, Near Masjid, Uppal, Hyderabad 500039',
  phone: '+91 40 4310 8108',
  latitude: 17.4019,
  longitude: 78.5596,
},
{
  id: 'hosp-medipally-kakatiya',
  name: 'Kakatiya Hospitals, Medipally',
  type: 'HOSPITAL',
  address: '12-52, Road No. 2, P&T Colony, Medipally, Telangana 500098',
  phone: '+919652244111',
  latitude: 17.405252,
  longitude: 78.612374,
},
{
  id: 'hosp-narapally-ankura',
  name: 'Ankura Hospital for Women & Children, Uppal',
  type: 'HOSPITAL',
  address: 'Plot No. 1-18, Raghavendra Nagar, Narapally, Ghatkesar Road, Hyderabad 500092',
  phone: '+919053108108',
  latitude: 17.4210,
  longitude: 78.6270,
},
{
  id: 'hosp-pocharam-gss',
  name: 'GSS Hospitals, Narapally / Pocharam',
  type: 'HOSPITAL',
  address: '5-2, Hyderabad–Warangal Highway, Pocharam, Hyderabad 500088',
  phone: '+917337368777',
  latitude: 17.4250,
  longitude: 78.6250,
},
{
  id: 'hosp-narapally-vajra',
  name: 'Vajra Hospitals',
  type: 'HOSPITAL',
  address: 'Plot No. 1/S, Korremula Road, Hyderabad–Warangal Highway, Narepally, Hyderabad 500088',
  phone: '+919542443145',
  latitude: 17.4260,
  longitude: 78.6300,
},
];

// Haversine Distance Calculation Formula (in km)
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

export const MapView = () => {
  // Default coordinates centered on Hyderabad
  const [userCoords, setUserCoords] = useState({ lat: 17.3850, lon: 78.4867 });
  const [isLiveGps, setIsLiveGps] = useState(false);
  const [locating, setLocating] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [locationStatus, setLocationStatus] = useState('Detecting Live Location...');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setUserCoords({ lat, lon });
          setIsLiveGps(true);
          setLocationStatus(`Live Location Accessed (${lat.toFixed(4)}°, ${lon.toFixed(4)}°)`);
          setLocating(false);
        },
        (err) => {
          console.warn('Geolocation permission denied or timed out. Falling back to Hyderabad center.', err);
          setLocationStatus('Telangana Region (Hyderabad Default)');
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationStatus('Geolocation Not Supported by Browser');
    }
  };

  // Compute live distance for all places and sort by nearest first
  const processedLocations = HYDERABAD_PLACES.map((loc) => {
    const distanceKm = calculateDistanceKm(userCoords.lat, userCoords.lon, loc.latitude, loc.longitude);
    return { ...loc, distanceKm };
  })
    .filter((loc) => filterType === 'ALL' || loc.type === filterType)
    .filter((loc) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return loc.name.toLowerCase().includes(q) || loc.address.toLowerCase().includes(q);
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-1">
            <Compass className="w-3.5 h-3.5 text-blue-600" /> Geolocation Nearest Services Engine
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-brand-600" /> Live Location Map & Services
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Auto-detects live GPS coordinates to show nearby verified Pharmacies, NGOs, and Hospitals sorted by distance.
          </p>
        </div>

        {/* Live GPS Trigger Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={detectLocation}
            disabled={locating}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            <Navigation2 className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
            {locating ? 'Accessing GPS...' : 'Access My Live Location'}
          </button>
        </div>
      </div>

      {/* Location Status Pill */}
      <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Status: <strong>{locationStatus}</strong></span>
        </div>
        {isLiveGps && (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            Live GPS Active
          </span>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterType === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700'
            }`}
          >
            All Services ({HYDERABAD_PLACES.length})
          </button>
          <button
            onClick={() => setFilterType('NGO')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'NGO' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" /> NGOs ({HYDERABAD_PLACES.filter(p => p.type === 'NGO').length})
          </button>
          <button
            onClick={() => setFilterType('PHARMACY')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'PHARMACY' ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Pharmacies ({HYDERABAD_PLACES.filter(p => p.type === 'PHARMACY').length})
          </button>
          <button
            onClick={() => setFilterType('HOSPITAL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'HOSPITAL' ? 'bg-rose-600 text-white shadow-sm' : 'bg-rose-50 text-rose-800'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" /> Hospitals ({HYDERABAD_PLACES.filter(p => p.type === 'HOSPITAL').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by area or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Main Grid: Map + Nearest Places Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map Frame (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-md p-2 h-[580px] relative overflow-hidden">
          <MapContainer
            center={[userCoords.lat, userCoords.lon]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', borderRadius: '1.25rem' }}
          >
            <MapRecenter lat={userCoords.lat} lon={userCoords.lon} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Live Position Marker */}
            <Marker position={[userCoords.lat, userCoords.lon]} icon={userLiveIcon}>
              <Popup>
                <div className="p-1 font-bold text-slate-900 text-xs text-center">
                  📍 Your Current Live Location
                  <div className="text-[10px] text-blue-600 font-mono">
                    {userCoords.lat.toFixed(4)}°, {userCoords.lon.toFixed(4)}°
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Places Markers */}
            {processedLocations.map((loc) => {
              const markerIcon =
                loc.type === 'NGO'
                  ? ngoIcon
                  : loc.type === 'PHARMACY'
                  ? pharmacyIcon
                  : hospitalIcon;

              return (
                <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={markerIcon}>
                  <Popup>
                    <div className="space-y-2 p-1 min-w-[210px] text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900">{loc.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            loc.type === 'NGO'
                              ? 'bg-emerald-100 text-emerald-800'
                              : loc.type === 'PHARMACY'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {loc.type}
                        </span>
                      </div>

                      <p className="text-slate-600 leading-tight">{loc.address}</p>

                      <div className="pt-1 border-t border-slate-100 space-y-1">
                        <div className="font-mono text-slate-700 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {loc.phone}
                        </div>
                        <div className="font-extrabold text-blue-700">
                          📍 {loc.distanceKm} km away from you
                        </div>
                      </div>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 w-full py-1.5 bg-brand-600 text-white font-extrabold text-[11px] rounded-lg flex items-center justify-center gap-1 hover:bg-brand-700"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Directions on Google Maps
                      </a>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Nearest Sorted Places Cards List (1 Col) */}
        <div className="lg:col-span-1 bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-4 max-h-[580px] overflow-y-auto">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-base">Nearest Services ({processedLocations.length})</h2>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Sorted by Distance
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {processedLocations.length === 0 ? (
              <div className="p-4 text-center text-slate-400 font-semibold">No services found matching search query.</div>
            ) : (
              processedLocations.map((loc) => (
                <div
                  key={loc.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition-all space-y-2 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide mb-1 ${
                          loc.type === 'NGO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : loc.type === 'PHARMACY'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {loc.type}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{loc.name}</h3>
                    </div>
                    <span className="shrink-0 text-xs font-extrabold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-1 rounded-xl">
                      {loc.distanceKm} km
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-snug">{loc.address}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                    <span className="font-mono text-slate-600 font-semibold">{loc.phone}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-brand-700 hover:underline flex items-center gap-1"
                    >
                      Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
