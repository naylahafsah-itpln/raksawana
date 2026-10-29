import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, Bell,
  Camera, Check, ChevronDown, Clock3, CloudSun, Compass, Crosshair, ExternalLink,
  Flame, Gauge, History, Layers3, LocateFixed, Map as MapIcon, MapPin,
  Menu, Radio, Search, Settings2, ShieldCheck, Satellite, Thermometer, Wind, X
} from 'lucide-react';

const LOCATIONS = [
  { id: 'LOC-01', name: 'Taman Nasional Kutai', region: 'Kalimantan Timur', islandGroup: 'Kalimantan', lat: 0.4354, lng: 117.2514, temp: 36.8, humidity: 32, risk: 'Tinggi', probability: 88, status: 'Perlu diperiksa', sensorId: 'SNS-KT-01', sensorStatus: 'Online', lastUpdate: '10 menit lalu', hotspotDetected: true, hotspotConfidence: 85 },
  { id: 'LOC-02', name: 'Hutan Gambut Sebangau', region: 'Kalimantan Tengah', islandGroup: 'Kalimantan', lat: -2.3167, lng: 113.9167, temp: 37.5, humidity: 28, risk: 'Tinggi', probability: 92, status: 'Perlu diperiksa', sensorId: 'SNS-SB-02', sensorStatus: 'Online', lastUpdate: '5 menit lalu', hotspotDetected: true, hotspotConfidence: 91 },
  { id: 'LOC-03', name: 'Cagar Alam Ketapang', region: 'Kalimantan Barat', islandGroup: 'Kalimantan', lat: -1.8333, lng: 110, temp: 33.2, humidity: 54, risk: 'Sedang', probability: 56, status: 'Dipantau', sensorId: 'SNS-KB-03', sensorStatus: 'Online', lastUpdate: '12 menit lalu', hotspotDetected: false, hotspotConfidence: 0 },
  { id: 'LOC-04', name: 'Taman Nasional Berbak', region: 'Jambi', islandGroup: 'Sumatra', lat: -1.4167, lng: 104.25, temp: 38.1, humidity: 25, risk: 'Tinggi', probability: 95, status: 'Tim dikerahkan', sensorId: 'SNS-JB-04', sensorStatus: 'Online', lastUpdate: '2 menit lalu', hotspotDetected: true, hotspotConfidence: 96 },
  { id: 'LOC-05', name: 'Konservasi Riau Central', region: 'Riau', islandGroup: 'Sumatra', lat: 0.5333, lng: 101.45, temp: 34, humidity: 48, risk: 'Sedang', probability: 60, status: 'Dipantau', sensorId: 'SNS-RU-05', sensorStatus: 'Perlu diperiksa', lastUpdate: '45 menit lalu', hotspotDetected: false, hotspotConfidence: 12 },
  { id: 'LOC-06', name: 'Kawasan Ogan Komering', region: 'Sumatra Selatan', islandGroup: 'Sumatra', lat: -3.3667, lng: 104.8333, temp: 31.5, humidity: 65, risk: 'Rendah', probability: 22, status: 'Aman', sensorId: 'SNS-SS-06', sensorStatus: 'Online', lastUpdate: '18 menit lalu', hotspotDetected: false, hotspotConfidence: 0 },
  { id: 'LOC-07', name: 'Hutan Bukit Soeharto', region: 'Kalimantan Timur', islandGroup: 'Kalimantan', lat: -0.8667, lng: 116.9833, temp: 32.1, humidity: 60, risk: 'Rendah', probability: 30, status: 'Aman', sensorId: 'SNS-KT-07', sensorStatus: 'Offline', lastUpdate: '3 jam lalu', hotspotDetected: false, hotspotConfidence: 0 },
  { id: 'LOC-08', name: 'Taman Nasional Way Kambas', region: 'Lampung', islandGroup: 'Sumatra', lat: -5, lng: 105.75, temp: 35.8, humidity: 40, risk: 'Sedang', probability: 68, status: 'Perlu diperiksa', sensorId: 'SNS-LP-08', sensorStatus: 'Online', lastUpdate: '8 menit lalu', hotspotDetected: true, hotspotConfidence: 72 },
  { id: 'LOC-09', name: 'Taman Nasional Baluran', region: 'Jawa Timur', islandGroup: 'Jawa', lat: -7.847, lng: 114.394, temp: 35.1, humidity: 39, risk: 'Sedang', probability: 64, status: 'Dipantau', sensorId: 'SNS-JT-09', sensorStatus: 'Online', lastUpdate: '16 menit lalu', hotspotDetected: false, hotspotConfidence: 0 },
  { id: 'LOC-10', name: 'Taman Nasional Komodo', region: 'Nusa Tenggara Timur', islandGroup: 'Bali & Nusa Tenggara', lat: -8.587, lng: 119.489, temp: 36.2, humidity: 35, risk: 'Tinggi', probability: 81, status: 'Perlu diperiksa', sensorId: 'SNS-NT-10', sensorStatus: 'Online', lastUpdate: '9 menit lalu', hotspotDetected: true, hotspotConfidence: 78 },
  { id: 'LOC-11', name: 'Taman Nasional Lore Lindu', region: 'Sulawesi Tengah', islandGroup: 'Sulawesi', lat: -1.327, lng: 120.297, temp: 32.8, humidity: 57, risk: 'Rendah', probability: 31, status: 'Aman', sensorId: 'SNS-SL-11', sensorStatus: 'Online', lastUpdate: '22 menit lalu', hotspotDetected: false, hotspotConfidence: 0 },
  { id: 'LOC-12', name: 'Taman Nasional Manusela', region: 'Maluku', islandGroup: 'Maluku', lat: -3.1, lng: 129.45, temp: 34.4, humidity: 48, risk: 'Sedang', probability: 53, status: 'Dipantau', sensorId: 'SNS-ML-12', sensorStatus: 'Online', lastUpdate: '27 menit lalu', hotspotDetected: false, hotspotConfidence: 0 },
  { id: 'LOC-13', name: 'Taman Nasional Wasur', region: 'Papua Selatan', islandGroup: 'Papua', lat: -8.495, lng: 140.46, temp: 37.2, humidity: 29, risk: 'Tinggi', probability: 90, status: 'Perlu diperiksa', sensorId: 'SNS-PS-13', sensorStatus: 'Online', lastUpdate: '6 menit lalu', hotspotDetected: true, hotspotConfidence: 89 }
];

const ISLAND_GROUPS = ['Semua wilayah', 'Sumatra', 'Jawa', 'Bali & Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku', 'Papua'];

const CAMERAS = [
  { id: 'CAM-01', name: 'Kamera Kutai', region: 'Kalimantan Timur', lat: 0.4512, lng: 117.2448, status: 'Aktif' },
  { id: 'CAM-02', name: 'Kamera Sebangau', region: 'Kalimantan Tengah', lat: -2.3271, lng: 113.9161, status: 'Aktif' },
  { id: 'CAM-03', name: 'Kamera Ketapang', region: 'Kalimantan Barat', lat: -1.8134, lng: 110.0147, status: 'Siap' },
  { id: 'CAM-04', name: 'Kamera Berbak', region: 'Jambi', lat: -1.4245, lng: 104.2375, status: 'Aktif' },
  { id: 'CAM-05', name: 'Kamera Riau', region: 'Riau', lat: 0.5489, lng: 101.4621, status: 'Perlu kalibrasi' },
  { id: 'CAM-06', name: 'Kamera Ogan Komering', region: 'Sumatra Selatan', lat: -3.3702, lng: 104.8261, status: 'Aktif' },
  { id: 'CAM-07', name: 'Kamera Bukit Soeharto', region: 'Kalimantan Timur', lat: -0.8614, lng: 116.9804, status: 'Offline' },
  { id: 'CAM-08', name: 'Kamera Way Kambas', region: 'Lampung', lat: -4.9908, lng: 105.7643, status: 'Aktif' },
  { id: 'CAM-09', name: 'Kamera Baluran', region: 'Jawa Timur', lat: -7.847, lng: 114.394, status: 'Aktif' },
  { id: 'CAM-10', name: 'Kamera Komodo', region: 'Nusa Tenggara Timur', lat: -8.587, lng: 119.489, status: 'Siap' },
  { id: 'CAM-11', name: 'Kamera Lore Lindu', region: 'Sulawesi Tengah', lat: -1.327, lng: 120.297, status: 'Aktif' },
  { id: 'CAM-12', name: 'Kamera Manusela', region: 'Maluku', lat: -3.1, lng: 129.45, status: 'Aktif' },
  { id: 'CAM-13', name: 'Kamera Wasur', region: 'Papua Selatan', lat: -8.495, lng: 140.46, status: 'Aktif' }
];

const INITIAL_ALERTS = [
  { id: 1, title: 'Suhu tinggi dan kelembapan rendah', locationId: 'LOC-04', source: 'Sensor lapangan', time: '14:22 WIB', status: 'Belum ditinjau' },
  { id: 2, title: 'Titik panas terdeteksi satelit', locationId: 'LOC-02', source: 'Satelit VIIRS', time: '13:50 WIB', status: 'Belum ditinjau' },
  { id: 3, title: 'Sensor tidak mengirim data', locationId: 'LOC-07', source: 'Sensor lapangan', time: '11:15 WIB', status: 'Belum ditinjau' },
  { id: 4, title: 'Suhu meningkat dalam 4 jam terakhir', locationId: 'LOC-01', source: 'Sensor lapangan', time: '09:40 WIB', status: 'Ditinjau' },
  { id: 5, title: 'Anomali panas terpantau satelit', locationId: 'LOC-08', source: 'Satelit MODIS', time: '08:10 WIB', status: 'Ditinjau' }
];

const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: Gauge },
  { id: 'map', label: 'Peta & lokasi', icon: MapIcon },
  { id: 'sensors', label: 'Sensor', icon: Radio },
  { id: 'alerts', label: 'Peringatan', icon: Bell },
  { id: 'history', label: 'Riwayat', icon: History },
  { id: 'settings', label: 'Pengaturan', icon: Settings2 }
];

const PAGE_COPY = {
  overview: ['Pemantauan lapangan', 'Titik sensor dan indikasi panas di berbagai wilayah Indonesia'],
  map: ['Peta dan lokasi', 'Pantau titik sensor, indikasi panas, dan kamera'],
  sensors: ['Sensor lapangan', 'Status perangkat dan pembacaan terakhir'],
  alerts: ['Peringatan', 'Tinjau temuan dan tindak lanjut lapangan'],
  history: ['Riwayat pemantauan', 'Catatan sensor, satelit, dan operator'],
  settings: ['Pengaturan', 'Atur batas peringatan untuk data simulasi']
};

function distanceKm(a, b) {
  const radians = (value) => value * Math.PI / 180;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function nearestCamera(location) {
  return CAMERAS.reduce((nearest, camera) => {
    const distance = distanceKm(location, camera);
    return !nearest || distance < nearest.distance ? { ...camera, distance } : nearest;
  }, null);
}

function formatCoordinate(value, axis) {
  return `${Math.abs(value).toFixed(4)}° ${value < 0 ? axis[1] : axis[0]}`;
}

function StatusPill({ children, tone = 'neutral' }) {
  return <span className={`status-pill status-${tone}`}><span className="status-dot" />{children}</span>;
}

function RiskLabel({ risk }) {
  return <span className={`risk-label risk-${risk.toLowerCase()}`}><span />{risk}</span>;
}

function LeafletMap({ locations, selectedId, onSelect, onOpenCamera, basemap, compact = false }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const selectRef = useRef(onSelect);
  const cameraRef = useRef(onOpenCamera);
  selectRef.current = onSelect;
  cameraRef.current = onOpenCamera;

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const map = L.map(containerRef.current, { zoomControl: false, attributionControl: true, scrollWheelZoom: true });
    map.attributionControl.setPosition('bottomleft');
    L.control.zoom({ position: 'topright' }).addTo(map);
    map.setView([-2.5, 118], 4);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    const handlePopupClick = (event) => {
      const button = event.target.closest('[data-open-camera]');
      if (button) cameraRef.current(button.dataset.openCamera);
    };
    containerRef.current.addEventListener('click', handlePopupClick);

    return () => {
      containerRef.current?.removeEventListener('click', handlePopupClick);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    tileLayerRef.current?.removeFrom(map);
    const layer = basemap === 'citra'
      ? L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri'
      })
      : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
      });
    layer.addTo(map);
    tileLayerRef.current = layer;
  }, [basemap]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    locations.forEach((location) => {
      const marker = L.marker([location.lat, location.lng], {
        icon: L.divIcon({
          className: 'map-marker-shell',
          html: `<span class="map-marker-dot risk-dot-${location.risk.toLowerCase()} ${location.hotspotDetected ? 'has-hotspot' : ''} ${selectedId === location.id ? 'is-selected' : ''}"><span></span></span>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      }).addTo(layer);
      marker.on('click', () => selectRef.current(location.id));
      marker.bindPopup(`<div class="map-popup"><strong>${location.name}</strong><span>${location.region}</span><span>${location.lat}, ${location.lng}</span><b>Risiko ${location.risk} · ${location.probability}%</b></div>`);
    });

    CAMERAS.forEach((camera) => {
      const marker = L.marker([camera.lat, camera.lng], {
        icon: L.divIcon({
          className: 'map-marker-shell',
          html: '<span class="camera-map-marker"><span></span></span>',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        }),
        zIndexOffset: 500
      }).addTo(layer);
      marker.bindPopup(`
        <div class="camera-popup">
          <div class="camera-popup-title"><span class="camera-glyph"><span></span></span><div><small>KAMERA TERMAL · ${camera.status.toUpperCase()}</small><strong>${camera.name}</strong></div></div>
          <img src="https://i.ytimg.com/vi/DdK9BDTW0LI/maxresdefault.jpg" alt="Cuplikan video kamera thermal drone" />
          <div class="camera-popup-footer"><span>Cuplikan referensi, bukan siaran langsung</span><button type="button" data-open-camera="${camera.id}" aria-label="Buka video referensi"><span>↗</span></button></div>
        </div>
      `, { minWidth: 250, maxWidth: 280 });
    });

    if (!compact && locations.length) {
      map.fitBounds(L.latLngBounds(locations.map((location) => [location.lat, location.lng])), { padding: [28, 28], maxZoom: 6 });
    } else if (compact) {
      map.setView([-2.5, 118], 4);
    }
    window.setTimeout(() => map.invalidateSize(), 120);
  }, [locations, selectedId, compact]);

  return <div ref={containerRef} className={`leaflet-map ${compact ? 'leaflet-map-compact' : ''}`} aria-label="Peta pemantauan Indonesia" />;
}

function ThermalDialog({ camera, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('dialog-open');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('dialog-open');
    };
  }, [onClose]);

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="thermal-dialog" role="dialog" aria-modal="true" aria-labelledby="thermal-title">
        <header className="dialog-header">
          <div><p className="eyebrow">Cuplikan kamera thermal · referensi</p><h2 id="thermal-title">{camera.name}</h2></div>
          <button className="icon-button dialog-close" onClick={onClose} aria-label="Tutup video"><X size={20} /></button>
        </header>
        <div className="thermal-feed-layout">
          <div className="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/DdK9BDTW0LI?autoplay=1&mute=1&rel=0" title="Spotting Brush Fire Hot Spots with a FLIR Thermal Drone" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
          <aside className="thermal-scale" aria-label="Skala warna suhu thermal dalam Fahrenheit, dari 48,9 hingga 245,4 derajat">
            <div className="thermal-scale-reading">245.4<span>°F</span></div>
            <div className="thermal-scale-ranges">
              <div className="thermal-gradient" aria-hidden="true" />
              <div className="thermal-ticks" aria-hidden="true">
                <span className="thermal-tick tick-200">200</span>
                <span className="thermal-tick tick-150">150</span>
                <span className="thermal-tick tick-100">100</span>
                <span className="thermal-tick tick-50">50</span>
              </div>
            </div>
            <div className="thermal-scale-reading thermal-scale-low">48.9<span>°F</span></div>
          </aside>
        </div>
        <p className="thermal-scale-note">Contoh skala dari gambar referensi. Suhu aktual bergantung pada kamera dan kalibrasinya.</p>
        <div className="dialog-meta"><span>{camera.region}</span><span>{camera.lat.toFixed(4)}, {camera.lng.toFixed(4)}</span><a href="https://www.youtube.com/watch?v=DdK9BDTW0LI" target="_blank" rel="noreferrer">Buka video sumber <ExternalLink size={13} /></a></div>
      </section>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('overview');
  const [selectedId, setSelectedId] = useState(LOCATIONS[0].id);
  const [region, setRegion] = useState('Semua wilayah');
  const [siteMenuOpen, setSiteMenuOpen] = useState(false);
  const [risk, setRisk] = useState('Semua risiko');
  const [basemap, setBasemap] = useState('citra');
  const [hotspotsOnly, setHotspotsOnly] = useState(false);
  const [mapQuery, setMapQuery] = useState('');
  const [sensorQuery, setSensorQuery] = useState('');
  const [sensorStatusFilter, setSensorStatusFilter] = useState('Semua status');
  const [alertFilter, setAlertFilter] = useState('Semua peringatan');
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [camera, setCamera] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [thresholds, setThresholds] = useState({ temperature: 36, humidity: 30 });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const selectedLocation = LOCATIONS.find((location) => location.id === selectedId) || LOCATIONS[0];
  const closestCamera = nearestCamera(selectedLocation);
  const filteredLocations = useMemo(() => LOCATIONS.filter((location) => {
    const text = `${location.name} ${location.region} ${location.sensorId} ${location.lat} ${location.lng}`.toLowerCase();
    const regionMatches = region === 'Semua wilayah' || location.islandGroup === region;
    return regionMatches && (risk === 'Semua risiko' || location.risk === risk) && (!hotspotsOnly || location.hotspotDetected) && text.includes(mapQuery.trim().toLowerCase());
  }), [region, risk, hotspotsOnly, mapQuery]);
  const filteredSensors = useMemo(() => LOCATIONS.filter((location) => {
    const matchesText = `${location.name} ${location.region} ${location.sensorId}`.toLowerCase().includes(sensorQuery.toLowerCase());
    const matchesStatus = sensorStatusFilter === 'Semua status' || location.sensorStatus === sensorStatusFilter;
    return matchesText && matchesStatus;
  }), [sensorQuery, sensorStatusFilter]);
  const visibleAlerts = alertFilter === 'Belum ditinjau'
    ? alerts.filter((alert) => alert.status === 'Belum ditinjau')
    : alerts;
  const unreadCount = alerts.filter((alert) => alert.status === 'Belum ditinjau').length;
  const highRiskCount = LOCATIONS.filter((location) => location.risk === 'Tinggi').length;
  const onlineCount = LOCATIONS.filter((location) => location.sensorStatus === 'Online').length;
  const hotspotCount = LOCATIONS.filter((location) => location.hotspotDetected).length;

  useEffect(() => {
    if (!siteMenuOpen) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && setSiteMenuOpen(false);
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [siteMenuOpen]);

  useEffect(() => {
    const focusMapSearch = (event) => {
      const target = event.target;
      const isEditing = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if (event.key === '/' && !isEditing) {
        const search = document.getElementById('mapSearch') || document.querySelector('.map-search input');
        if (search) {
          event.preventDefault();
          search.focus();
        }
      }
    };
    document.addEventListener('keydown', focusMapSearch);
    return () => document.removeEventListener('keydown', focusMapSearch);
  }, []);

  const goTo = (nextPage) => {
    setPage(nextPage);
    setMenuOpen(false);
    setNotificationOpen(false);
    setSiteMenuOpen(false);
  };
  const selectIslandGroup = (group) => {
    setRegion(group);
    setRisk('Semua risiko');
    setHotspotsOnly(false);
    setMapQuery('');
    const candidate = LOCATIONS.find((location) => group === 'Semua wilayah' || location.islandGroup === group);
    if (candidate) setSelectedId(candidate.id);
    setSiteMenuOpen(false);
    goTo('map');
  };
  const openOnlineSensors = () => {
    setSensorQuery('');
    setSensorStatusFilter('Online');
    goTo('sensors');
  };
  const openHighRiskLocations = () => {
    setRegion('Semua wilayah');
    setRisk('Tinggi');
    setHotspotsOnly(false);
    setMapQuery('');
    setSelectedId(LOCATIONS.find((location) => location.risk === 'Tinggi')?.id || LOCATIONS[0].id);
    goTo('map');
  };
  const openSatelliteHotspots = () => {
    setRegion('Semua wilayah');
    setRisk('Semua risiko');
    setHotspotsOnly(true);
    setMapQuery('');
    setSelectedId(LOCATIONS.find((location) => location.hotspotDetected)?.id || LOCATIONS[0].id);
    goTo('map');
  };
  const openPendingAlerts = () => {
    setAlertFilter('Belum ditinjau');
    goTo('alerts');
  };
  const selectLocation = (id) => setSelectedId(id);
  const openCamera = (cameraId) => setCamera(CAMERAS.find((item) => item.id === cameraId) || closestCamera);
  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };
  const markAlert = (id) => setAlerts((current) => current.map((alert) => alert.id === id ? { ...alert, status: 'Ditinjau' } : alert));
  const markAllAlerts = () => setAlerts((current) => current.map((alert) => ({ ...alert, status: 'Ditinjau' })));

  const mapPanel = (items, compact = false) => (
    <div className={`map-frame ${compact ? 'map-frame-compact' : ''}`}>
      <LeafletMap locations={items} selectedId={selectedId} onSelect={selectLocation} onOpenCamera={openCamera} basemap={basemap} compact={compact} />
      <div className="map-legend"><span><i className="legend-risk" /> Risiko</span><span><i className="legend-camera"><span /></i> Kamera</span></div>
      <div className="map-scale">PETA SEBARAN INDONESIA</div>
      <div className="map-style-control" role="group" aria-label="Tampilan peta">
        <button className={basemap === 'peta' ? 'selected' : ''} onClick={() => setBasemap('peta')} aria-pressed={basemap === 'peta'}><MapIcon size={13} />Peta</button>
        <button className={basemap === 'citra' ? 'selected' : ''} onClick={() => setBasemap('citra')} aria-pressed={basemap === 'citra'}><Satellite size={13} />Citra</button>
      </div>
    </div>
  );

  const renderLocationRows = (items, dense = false) => items.map((location) => (
    <button className={`location-row ${selectedId === location.id ? 'is-active' : ''} ${dense ? 'location-row-dense' : ''}`} key={location.id} onClick={() => selectLocation(location.id)}>
      <span className={`location-marker marker-${location.risk.toLowerCase()}`} />
      <span className="location-main"><strong>{location.name}</strong><small>{location.region}</small></span>
      <span className="location-reading"><strong>{location.temp.toFixed(1)}°</strong><small>{location.lastUpdate}</small></span>
      <RiskLabel risk={location.risk} />
    </button>
  ));

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-symbol"><span /><span /><span /></div>
          <div className="brand-wordmark"><strong>RAKSAWANA</strong><small>PANTAUAN HUTAN & LAHAN</small></div>
          <button className="icon-button mobile-menu-close" onClick={() => setMenuOpen(false)} aria-label="Tutup menu"><X size={18} /></button>
        </div>
        <div className="site-selector-wrap">
          <button className="site-selector" onClick={() => setSiteMenuOpen((open) => !open)} aria-expanded={siteMenuOpen} aria-haspopup="listbox">
            <span className="site-selector-icon"><MapPin size={16} /></span>
            <span><small>WILAYAH KERJA</small><strong>{region === 'Semua wilayah' ? 'Seluruh Indonesia' : region}</strong></span>
            <ChevronDown size={14} />
          </button>
          {siteMenuOpen && <div className="site-selector-menu" role="group" aria-label="Pilih wilayah">
            {ISLAND_GROUPS.map((group) => {
              const count = group === 'Semua wilayah' ? LOCATIONS.length : LOCATIONS.filter((location) => location.islandGroup === group).length;
              return <button key={group} aria-pressed={region === group} onClick={() => selectIslandGroup(group)}><span>{group === 'Semua wilayah' ? 'Seluruh Indonesia' : group}</span><small>{count} lokasi</small>{region === group && <Check size={14} />}</button>;
            })}
          </div>}
        </div>
        <nav className="primary-nav" aria-label="Navigasi utama">
          <span className="nav-caption">Pantauan</span>
          {NAV_ITEMS.slice(0, 4).map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${page === id ? 'nav-active' : ''}`} onClick={() => goTo(id)}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{id === 'alerts' && unreadCount > 0 && <span className="nav-count">{unreadCount}</span>}</button>)}
          <span className="nav-caption nav-caption-spaced">Catatan</span>
          {NAV_ITEMS.slice(4).map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${page === id ? 'nav-active' : ''}`} onClick={() => goTo(id)}><Icon size={17} strokeWidth={1.8} /><span>{label}</span></button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="field-brief"><span className="brief-light" /><div><strong>Data simulasi</strong><small>Belum terhubung ke perangkat lapangan</small></div></div>
          <div className="operator"><div className="operator-avatar">PL</div><div><strong>Petugas lapangan</strong><small>Posko pemantauan</small></div></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu-button" onClick={() => setMenuOpen(true)} aria-label="Buka menu"><Menu size={19} /></button>
          <div className="breadcrumbs"><span>RAKSAWANA</span><span className="crumb-slash">/</span><strong>{PAGE_COPY[page][0]}</strong></div>
          <div className="topbar-tools"><span className="topbar-date"><Clock3 size={15} />28 Oktober 2026 <i /> 18:30 WIB</span><div className="notification-anchor"><button className={`icon-button notification-button ${notificationOpen ? 'button-active' : ''}`} onClick={() => setNotificationOpen((open) => !open)} aria-label="Buka peringatan"><Bell size={18} />{unreadCount > 0 && <span className="notification-indicator" />}</button>{notificationOpen && <div className="notification-popover"><div className="popover-heading"><strong>Peringatan terbaru</strong><button className="text-action" onClick={markAllAlerts}>Tandai semua</button></div>{alerts.filter((alert) => alert.status === 'Belum ditinjau').slice(0, 3).map((alert) => <button className="popover-alert" key={alert.id} onClick={() => { goTo('alerts'); setNotificationOpen(false); }}><span className="alert-mark"><AlertTriangle size={14} /></span><span><strong>{alert.title}</strong><small>{LOCATIONS.find((item) => item.id === alert.locationId)?.name} · {alert.time}</small></span></button>)}<button className="popover-footer" onClick={() => goTo('alerts')}>Buka semua peringatan <ArrowRight size={14} /></button></div>}</div><div className="topbar-data-stamp"><Activity size={14} /><span><strong>Data demo</strong><small>28 Okt · 18:30 WIB</small></span></div></div>
        </header>

        <div className="page-content">
          {page === 'map' && hotspotsOnly && <div className="active-filter-banner"><span><Satellite size={14} />Menampilkan {hotspotCount} indikasi panas dari satelit</span><button onClick={() => setHotspotsOnly(false)}>Tampilkan semua lokasi <X size={13} /></button></div>}
          {page === 'sensors' && sensorStatusFilter !== 'Semua status' && <div className="active-filter-banner"><span><Radio size={14} />Filter perangkat: {sensorStatusFilter} · {filteredSensors.length} sensor</span><button onClick={() => setSensorStatusFilter('Semua status')}>Hapus filter <X size={13} /></button></div>}
          {page === 'alerts' && alertFilter !== 'Semua peringatan' && <div className="active-filter-banner"><span><Bell size={14} />Menampilkan {visibleAlerts.length} peringatan belum ditinjau</span><button onClick={() => setAlertFilter('Semua peringatan')}>Tampilkan semua <X size={13} /></button></div>}
          <section className="page-heading"><div><div className="eyebrow">Catatan lapangan <span /> Seluruh Indonesia</div><h1>{PAGE_COPY[page][0]}</h1><p>{PAGE_COPY[page][1]}</p></div></section>

          {page === 'overview' && <>
            <section className="dashboard-stage">
              <article className="map-overview">
                <header className="section-heading">
                  <div><div className="eyebrow">Nusantara</div><h2>Titik pantau</h2></div>
                  <div className="overview-map-status"><span className="overview-status-dot" />{LOCATIONS.length} lokasi · diperbarui 18:30 WIB</div>
                </header>
                {mapPanel(LOCATIONS)}
                <footer className="map-footer"><span><i className="footer-dot dot-green" />{LOCATIONS.length} lokasi dipantau</span><span><i className="footer-dot dot-orange" />{highRiskCount} prioritas tinggi</span><button onClick={() => goTo('map')}>Buka peta lengkap <ArrowRight size={13} /></button></footer>
              </article>
              <aside className="field-notes">
                <div className="field-notes-heading"><span className="eyebrow">Catatan lapangan</span><h2>Perlu pengecekan</h2><p>{highRiskCount} lokasi menunjukkan risiko tinggi hari ini.</p></div>
                <div className="field-risk-list">{LOCATIONS.filter((item) => item.risk === 'Tinggi').map((location, index) => <button key={location.id} className="field-risk-row" onClick={() => { selectLocation(location.id); goTo('map'); }}><span className="field-risk-index">0{index + 1}</span><span className="field-risk-copy"><strong>{location.name}</strong><small>{location.region}</small><span>{location.temp.toFixed(1)}°C <i /> RH {location.humidity}%</span></span><b>{location.probability}<small>%</small></b></button>)}</div>
                <button className="field-notes-link" onClick={openHighRiskLocations}>Lihat titik di peta <ArrowRight size={14} /></button>
                <div className="field-notes-foot"><ShieldCheck size={15} /><span>Indikasi satelit dan sensor perlu dikonfirmasi petugas.</span></div>
              </aside>
            </section>

            <section className="metric-strip" aria-label="Ringkasan kondisi">
              <button type="button" className="metric-cell metric-action" onClick={openOnlineSensors} aria-label={`Buka ${onlineCount} sensor online`}><span className="metric-icon metric-green"><Radio size={17} /></span><div><small>Sensor online</small><strong>{onlineCount}<em> / {LOCATIONS.length}</em></strong><span className="metric-foot">Lihat perangkat</span></div><ArrowUpRight className="metric-trend trend-green" size={17} /></button>
              <button type="button" className="metric-cell metric-action" onClick={openHighRiskLocations} aria-label={`Buka ${highRiskCount} lokasi risiko tinggi`}><span className="metric-icon metric-red"><Flame size={17} /></span><div><small>Risiko tinggi</small><strong>{highRiskCount}<em> lokasi</em></strong><span className="metric-foot">Periksa titiknya</span></div><ArrowUpRight className="metric-trend trend-red" size={17} /></button>
              <button type="button" className="metric-cell metric-action" onClick={openSatelliteHotspots} aria-label={`Buka ${hotspotCount} titik panas satelit`}><span className="metric-icon metric-amber"><Crosshair size={17} /></span><div><small>Titik panas satelit</small><strong>{hotspotCount}<em> titik</em></strong><span className="metric-foot">Lihat data MODIS & VIIRS</span></div><ArrowDownRight className="metric-trend trend-muted" size={17} /></button>
              <button type="button" className="metric-cell metric-action" onClick={openPendingAlerts} aria-label={`Buka ${unreadCount} peringatan belum ditinjau`}><span className="metric-icon metric-blue"><Bell size={17} /></span><div><small>Belum ditinjau</small><strong>{unreadCount}<em> peringatan</em></strong><span className="metric-foot">Buka catatan petugas</span></div><ArrowUpRight className="metric-trend trend-muted" size={17} /></button>
            </section>

            <section className="lower-grid"><article className="location-panel"><header className="section-heading"><div><div className="eyebrow">Pembaruan terbaru</div><h2>Kondisi lokasi</h2></div><button className="text-action" onClick={() => goTo('map')}>Semua lokasi <ArrowRight size={14} /></button></header><div className="location-list">{renderLocationRows(LOCATIONS.slice(0, 4), true)}</div></article><article className="camera-feature"><div className="camera-feature-head"><div><div className="eyebrow">Kamera termal</div><h2>Kamera terdekat</h2></div><Camera size={18} /></div><button className="camera-feature-image" onClick={() => openCamera(closestCamera.id)} aria-label="Buka cuplikan thermal"><img src="https://i.ytimg.com/vi/DdK9BDTW0LI/maxresdefault.jpg" alt="Cuplikan thermal drone pemantau titik panas" /><span className="play-control">▶</span><span className="image-reference">CUPLIKAN VIDEO</span></button><div className="camera-feature-meta"><div><strong>{closestCamera.name}</strong><span>{closestCamera.region}</span></div><button onClick={() => openCamera(closestCamera.id)} aria-label="Buka video referensi"><ArrowRight size={17} /></button></div><p>Video contoh pemantauan titik panas menggunakan kamera thermal drone. Bukan siaran langsung.</p></article></section>
          </>}

          {page === 'map' && <div className="island-group-filter" role="group" aria-label="Filter pulau">
            {ISLAND_GROUPS.map((group) => <button key={group} className={region === group ? 'selected' : ''} aria-pressed={region === group} onClick={() => {
              setRegion(group);
              setMapQuery('');
              const candidate = LOCATIONS.find((location) => (group === 'Semua wilayah' || location.islandGroup === group) && (risk === 'Semua risiko' || location.risk === risk) && (!hotspotsOnly || location.hotspotDetected));
              if (candidate) setSelectedId(candidate.id);
            }}>{group}</button>)}
          </div>}

          {page === 'map' && <section className="map-workspace"><div className="surface map-main-panel"><div className="map-toolbar"><label className="map-search"><Search size={16} /><input value={mapQuery} onChange={(event) => setMapQuery(event.target.value)} placeholder="Cari lokasi, wilayah, sensor, atau koordinat" /><kbd>/</kbd></label><label className="select-wrap"><span>Wilayah</span><select value={region} onChange={(event) => setRegion(event.target.value)}><option>Semua wilayah</option><option>Kalimantan</option><option>Sumatra</option></select><ChevronDown size={14} /></label><label className="select-wrap"><span>Risiko</span><select value={risk} onChange={(event) => setRisk(event.target.value)}><option>Semua risiko</option><option>Tinggi</option><option>Sedang</option><option>Rendah</option></select><ChevronDown size={14} /></label><span className="result-count">{filteredLocations.length} titik</span></div>{mapPanel(filteredLocations)}<div className="map-key"><span><i className="key-dot key-high" />Risiko tinggi</span><span><i className="key-dot key-mid" />Risiko sedang</span><span><i className="key-dot key-low" />Risiko rendah</span><span><i className="key-camera"><span /></i>Kamera thermal</span></div></div><aside className="surface map-side-panel"><header className="section-heading"><div><div className="eyebrow">DAFTAR LOKASI</div><h2>{filteredLocations.length} titik terpantau</h2></div><Layers3 size={17} /></header><div className="map-location-list">{filteredLocations.length ? filteredLocations.map((location) => <button key={location.id} className={`map-location-item ${selectedId === location.id ? 'selected' : ''}`} onClick={() => selectLocation(location.id)}><div className="map-location-head"><strong>{location.name}</strong><RiskLabel risk={location.risk} /></div><span>{location.region}</span><div className="coordinate-line"><span>LAT <b>{location.lat.toFixed(4)}</b></span><span>LNG <b>{location.lng.toFixed(4)}</b></span></div></button>) : <div className="empty-results"><Search size={18} /><strong>Tidak ada lokasi ditemukan</strong><span>Coba kata kunci atau filter lain.</span></div>}</div><div className="location-detail"><div className="detail-topline"><span className="eyebrow">LOKASI TERPILIH</span><RiskLabel risk={selectedLocation.risk} /></div><h3>{selectedLocation.name}</h3><span className="detail-region">{selectedLocation.region}</span><div className="detail-stats"><span><Thermometer size={14} />{selectedLocation.temp}°C</span><span><Wind size={14} />{selectedLocation.humidity}% RH</span></div><div className="detail-probability"><span>Perkiraan risiko</span><strong>{selectedLocation.probability}%</strong></div><div className="probability-track"><span style={{ width: `${selectedLocation.probability}%` }} /></div><button className="nearest-camera-row" onClick={() => openCamera(closestCamera.id)}><Camera size={16} /><span><small>KAMERA TERDEKAT · {closestCamera.distance.toFixed(1)} KM</small><strong>{closestCamera.name}</strong></span><ArrowRight size={15} /></button></div></aside></section>}

          {page === 'sensors' && <section className="surface table-surface"><header className="section-heading table-heading"><div><div className="eyebrow">PERANGKAT LAPANGAN</div><h2>Status dan pembacaan sensor</h2></div><label className="map-search sensor-search"><Search size={16} /><input value={sensorQuery} onChange={(event) => setSensorQuery(event.target.value)} placeholder="Cari sensor atau lokasi" /></label></header><div className="table-scroll"><table><thead><tr><th>Perangkat</th><th>Lokasi</th><th>Suhu</th><th>Kelembapan</th><th>Pembaruan</th><th>Status</th><th>Risiko</th><th /></tr></thead><tbody>{filteredSensors.map((location) => <tr key={location.id}><td><strong className="table-device">{location.sensorId}</strong><small>Sensor lingkungan</small></td><td><strong>{location.name}</strong><small>{location.region}</small></td><td className={location.temp >= 36 ? 'reading-warm' : ''}>{location.temp.toFixed(1)} °C</td><td>{location.humidity} %</td><td>{location.lastUpdate}</td><td><StatusPill tone={location.sensorStatus === 'Online' ? 'green' : location.sensorStatus === 'Offline' ? 'red' : 'amber'}>{location.sensorStatus}</StatusPill></td><td><RiskLabel risk={location.risk} /></td><td><button className="row-action" onClick={() => { selectLocation(location.id); goTo('map'); }}>Lihat peta <ArrowRight size={13} /></button></td></tr>)}</tbody></table></div><footer className="table-footer">Menampilkan {filteredSensors.length} dari {LOCATIONS.length} perangkat <span>Data simulasi</span></footer></section>}

          {page === 'alerts' && <section className="alerts-layout"><div className="surface alert-summary"><div className="eyebrow">STATUS TINJAUAN</div><strong>{unreadCount.toString().padStart(2, '0')}</strong><span>Peringatan menunggu tinjauan</span><button className="button-secondary" onClick={markAllAlerts}><Check size={15} />Tandai semua ditinjau</button></div><div className="surface alert-feed"><header className="section-heading"><div><div className="eyebrow">CATATAN PETUGAS</div><h2>Temuan terbaru</h2></div><span className="result-count">{visibleAlerts.length} catatan</span></header>{visibleAlerts.map((alert) => { const location = LOCATIONS.find((item) => item.id === alert.locationId); return <article className={`alert-item ${alert.status === 'Belum ditinjau' ? 'alert-unread' : ''}`} key={alert.id}><span className={`alert-icon ${location?.risk === 'Tinggi' ? 'alert-icon-high' : ''}`}>{location?.risk === 'Tinggi' ? <Flame size={17} /> : <AlertTriangle size={17} />}</span><div className="alert-content"><div className="alert-item-meta"><span>{alert.source}</span><time>{alert.time}</time></div><h3>{alert.title}</h3><p>{location?.name} · {location?.region}</p><div className="alert-data"><span><Thermometer size={13} />{location?.temp}°C</span><span><Wind size={13} />{location?.humidity}% RH</span><RiskLabel risk={location?.risk || 'Sedang'} /></div></div><div className="alert-actions"><StatusPill tone={alert.status === 'Ditinjau' ? 'green' : 'amber'}>{alert.status}</StatusPill>{alert.status === 'Belum ditinjau' && <button className="row-action" onClick={() => markAlert(alert.id)}>Tandai ditinjau <Check size={13} /></button>}</div></article>; })}</div></section>}

          {page === 'history' && <section className="surface table-surface"><header className="section-heading table-heading"><div><div className="eyebrow">LOG AKTIVITAS</div><h2>Riwayat pemantauan</h2></div><StatusPill tone="green">Tersimpan</StatusPill></header><div className="history-list">{[
            ['18:20 WIB', 'Suhu melewati 37°C', 'Hutan Gambut Sebangau', 'Sensor SNS-SB-02', 'orange'],
            ['17:45 WIB', 'Anomali panas terdeteksi', 'Taman Nasional Berbak', 'Satelit VIIRS', 'orange'],
            ['16:10 WIB', 'Petugas ditugaskan untuk pemeriksaan', 'Taman Nasional Kutai', 'Posko pemantauan', 'green'],
            ['14:00 WIB', 'Sensor tidak mengirim data', 'Hutan Bukit Soeharto', 'Sensor SNS-KT-07', 'red'],
            ['12:35 WIB', 'Pembaruan kondisi diterima', 'Taman Nasional Way Kambas', 'Sensor SNS-LP-08', 'green']
          ].map(([time, event, place, source, tone]) => <article key={`${time}-${place}`} className="history-row"><time>{time}</time><span className={`history-timeline history-${tone}`} /><div><strong>{event}</strong><span>{place} · {source}</span></div><ArrowRight size={15} /></article>)}</div></section>}

          {page === 'settings' && <section className="surface settings-surface"><header className="section-heading"><div><div className="eyebrow">BATAS PERINGATAN</div><h2>Parameter pemantauan</h2></div><Settings2 size={18} /></header><p className="settings-intro">Nilai ini hanya berlaku untuk tampilan simulasi. Perubahan belum dikirim ke perangkat lapangan.</p><label className="setting-row"><span><Thermometer size={17} /><span><strong>Suhu untuk perhatian</strong><small>Peringatan jika suhu melewati nilai ini</small></span></span><span className="number-input"><input type="number" value={thresholds.temperature} onChange={(event) => setThresholds((current) => ({ ...current, temperature: Number(event.target.value) }))} /><b>°C</b></span></label><label className="setting-row"><span><Wind size={17} /><span><strong>Kelembapan rendah</strong><small>Peringatan jika kelembapan di bawah nilai ini</small></span></span><span className="number-input"><input type="number" value={thresholds.humidity} onChange={(event) => setThresholds((current) => ({ ...current, humidity: Number(event.target.value) }))} /><b>%</b></span></label><div className="settings-actions"><span>{settingsSaved ? 'Perubahan tersimpan untuk sesi ini.' : 'Nilai awal: suhu 36°C, kelembapan 30%.'}</span><button className="button-primary" onClick={() => setSettingsSaved(true)}>Simpan pengaturan <ArrowRight size={15} /></button></div></section>}

          <footer className="page-footer"><span>RAKSAWANA <i /> DATA SIMULASI</span><span>Informasi risiko bukan pengganti pemeriksaan lapangan.</span></footer>
        </div>
      </main>
      {menuOpen && <button className="mobile-scrim" onClick={() => setMenuOpen(false)} aria-label="Tutup menu" />}
      {camera && <ThermalDialog camera={camera} onClose={() => setCamera(null)} />}
      {toast && <div className="toast-message"><Check size={15} />{toast}</div>}
    </div>
  );
}

export default App;
