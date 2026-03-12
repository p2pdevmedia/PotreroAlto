'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const LEAFLET_SCRIPT_ID = 'leaflet-cdn-script';
const LEAFLET_STYLESHEET_ID = 'leaflet-cdn-stylesheet';

const SECTOR_CENTER = {
  lat: -40.13691962008833,
  lng: -71.2525320779115
};

const SUBSECTOR_SPACING_METERS = 150;
const ROUTE_SPACING_METERS = 16;
const ROUTE_HEIGHT_METERS = 22;
const ROUTE_NEAR_THRESHOLD_METERS = 45;

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function toLatitudeDegrees(meters) {
  return meters / 111320;
}

function toLongitudeDegrees(meters, latitude) {
  return meters / (111320 * Math.cos(toRadians(latitude)));
}

function distanceInMeters(fromLat, fromLng, toLat, toLng) {
  const earthRadiusInMeters = 6371000;
  const latDistanceInRadians = toRadians(toLat - fromLat);
  const lngDistanceInRadians = toRadians(toLng - fromLng);
  const a =
    Math.sin(latDistanceInRadians / 2) * Math.sin(latDistanceInRadians / 2) +
    Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(lngDistanceInRadians / 2) * Math.sin(lngDistanceInRadians / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusInMeters * c;
}

function buildRoutesGeometry(subsectors) {
  if (!subsectors.length) {
    return [];
  }

  const centeredSubsectorIndex = (subsectors.length - 1) / 2;

  return subsectors.flatMap((subsector, subsectorIndex) => {
    const routes = subsector.routes ?? [];
    const centeredRouteIndex = (routes.length - 1) / 2;
    const subsectorOffsetMeters = (subsectorIndex - centeredSubsectorIndex) * SUBSECTOR_SPACING_METERS;
    const subsectorLatitude = SECTOR_CENTER.lat + toLatitudeDegrees((subsectorIndex % 3) * 12);
    const subsectorLongitude = SECTOR_CENTER.lng + toLongitudeDegrees(subsectorOffsetMeters, SECTOR_CENTER.lat);

    return routes.map((route, routeIndex) => {
      const routeOffsetMeters = (routeIndex - centeredRouteIndex) * ROUTE_SPACING_METERS;
      const baseLatitude = subsectorLatitude;
      const baseLongitude = subsectorLongitude + toLongitudeDegrees(routeOffsetMeters, subsectorLatitude);
      const topLatitude = baseLatitude + toLatitudeDegrees(ROUTE_HEIGHT_METERS);
      const topLongitude = baseLongitude + toLongitudeDegrees((routeIndex % 2 === 0 ? -2 : 2), subsectorLatitude);

      return {
        id: route.id ?? `${subsector.id ?? subsector.name}-${routeIndex}`,
        subsectorName: subsector.name,
        name: route.name ?? 'Vía sin nombre',
        grade: route.grade ?? 'Sin grado',
        baseLatitude,
        baseLongitude,
        polyline: [
          [baseLatitude, baseLongitude],
          [topLatitude, topLongitude]
        ]
      };
    });
  });
}

function loadLeafletAssets() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Leaflet solo puede cargarse en el navegador.'));
  }

  if (window.L) {
    return Promise.resolve(window.L);
  }

  const existingScript = document.getElementById(LEAFLET_SCRIPT_ID);

  if (!document.getElementById(LEAFLET_STYLESHEET_ID)) {
    const stylesheet = document.createElement('link');
    stylesheet.id = LEAFLET_STYLESHEET_ID;
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    stylesheet.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    stylesheet.crossOrigin = '';
    document.head.appendChild(stylesheet);
  }

  return new Promise((resolve, reject) => {
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.L), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('No se pudo cargar Leaflet desde CDN.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = LEAFLET_SCRIPT_ID;
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('No se pudo cargar Leaflet desde CDN.'));
    document.body.appendChild(script);
  });
}

export default function SectorRoutesMap({ subsectors, mapTitle }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const routesLayerRef = useRef(null);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [nearRouteMessage, setNearRouteMessage] = useState('');

  const routesGeometry = useMemo(() => buildRoutesGeometry(subsectors), [subsectors]);

  useEffect(() => {
    let isMounted = true;

    async function setupMap() {
      if (!mapContainerRef.current) {
        return;
      }

      const L = await loadLeafletAssets();

      if (!isMounted || mapRef.current) {
        return;
      }

      const map = L.map(mapContainerRef.current, {
        center: [SECTOR_CENTER.lat, SECTOR_CENTER.lng],
        zoom: 15,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      routesLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    }

    setupMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      routesLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function drawRoutes() {
      if (!mapRef.current || !routesLayerRef.current) {
        return;
      }

      const L = await loadLeafletAssets();

      if (!isMounted || !routesLayerRef.current) {
        return;
      }

      const layer = routesLayerRef.current;
      layer.clearLayers();

      routesGeometry.forEach((route) => {
        L.polyline(route.polyline, {
          color: '#f97316',
          weight: 3,
          opacity: 0.9
        }).addTo(layer);

        L.circleMarker([route.baseLatitude, route.baseLongitude], {
          radius: 5,
          color: '#facc15',
          fillColor: '#f97316',
          fillOpacity: 0.9,
          weight: 1
        })
          .bindPopup(
            `<strong>${route.name}</strong><br/>Subsector: ${route.subsectorName}<br/>Grado: ${route.grade}`
          )
          .addTo(layer);
      });

      if (routesGeometry.length > 0) {
        const bounds = L.latLngBounds(routesGeometry.flatMap((route) => route.polyline));
        mapRef.current.fitBounds(bounds.pad(0.25));
      }
    }

    drawRoutes();

    return () => {
      isMounted = false;
    };
  }, [routesGeometry]);

  const checkUserNearRoute = () => {
    if (typeof window === 'undefined' || !window.navigator?.geolocation) {
      setNearRouteMessage('Tu dispositivo o navegador no soporta geolocalización.');
      return;
    }

    if (!routesGeometry.length) {
      setNearRouteMessage('No hay vías disponibles para comparar distancia en este momento.');
      return;
    }

    setIsCheckingLocation(true);
    setNearRouteMessage('');

    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearestRoute = routesGeometry.reduce((nearest, currentRoute) => {
          const currentDistance = distanceInMeters(
            position.coords.latitude,
            position.coords.longitude,
            currentRoute.baseLatitude,
            currentRoute.baseLongitude
          );

          if (!nearest || currentDistance < nearest.distanceInMeters) {
            return {
              route: currentRoute,
              distanceInMeters: currentDistance
            };
          }

          return nearest;
        }, null);

        if (!nearestRoute) {
          setNearRouteMessage('No hay vías disponibles para comparar distancia en este momento.');
          setIsCheckingLocation(false);
          return;
        }

        if (nearestRoute.distanceInMeters <= ROUTE_NEAR_THRESHOLD_METERS) {
          setNearRouteMessage(
            `Estás cerca de "${nearestRoute.route.name}" (${Math.round(nearestRoute.distanceInMeters)} m).`
          );
        } else {
          setNearRouteMessage(
            `La vía más cercana es "${nearestRoute.route.name}" y está a ${Math.round(nearestRoute.distanceInMeters)} m.`
          );
        }

        setIsCheckingLocation(false);
      },
      () => {
        setNearRouteMessage('No pudimos obtener tu ubicación. Revisá los permisos de geolocalización.');
        setIsCheckingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-slate-700/60">
        <div ref={mapContainerRef} className="h-80 w-full md:h-96" aria-label={mapTitle} />
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Ubicación aproximada generada por orden de subsector y vías (de izquierda a derecha) para facilitar la orientación en el
        predio.
      </p>
      <div className="mt-4">
        <button
          type="button"
          onClick={checkUserNearRoute}
          disabled={isCheckingLocation}
          className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCheckingLocation ? 'Chequeando ubicación...' : '¿Estoy cerca de alguna vía?'}
        </button>
        {nearRouteMessage ? <p className="mt-3 text-sm text-slate-200">{nearRouteMessage}</p> : null}
      </div>
    </div>
  );
}
