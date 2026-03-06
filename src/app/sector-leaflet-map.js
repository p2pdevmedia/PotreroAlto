'use client';

import { useEffect, useMemo, useRef } from 'react';

const POTRERO_CENTER = {
  lat: -40.13691962008833,
  lng: -71.2525320779115
};

function ensureLeafletAssets() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Leaflet solo disponible en cliente'));
      return;
    }

    if (window.L) {
      resolve(window.L);
      return;
    }

    const existingScript = document.querySelector('script[data-leaflet-script="true"]');
    const existingStyle = document.querySelector('link[data-leaflet-style="true"]');

    if (!existingStyle) {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      style.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      style.crossOrigin = '';
      style.dataset.leafletStyle = 'true';
      document.head.appendChild(style);
    }

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.L));
      existingScript.addEventListener('error', () => reject(new Error('No se pudo cargar Leaflet')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.async = true;
    script.dataset.leafletScript = 'true';
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('No se pudo cargar Leaflet'));
    document.body.appendChild(script);
  });
}

function buildMapLayout(subsectors = []) {
  const subsectorCount = Math.max(subsectors.length, 1);

  return subsectors.map((subsector, subsectorIndex) => {
    const subsectorLng = POTRERO_CENTER.lng + (subsectorIndex - (subsectorCount - 1) / 2) * 0.0032;
    const subsectorLat = POTRERO_CENTER.lat + Math.sin(subsectorIndex * 0.9) * 0.0009;
    const routes = subsector.routes ?? [];
    const routeCount = Math.max(routes.length, 1);

    const routesWithGeometry = routes.map((route, routeIndex) => {
      const routeLng = subsectorLng + (routeIndex - (routeCount - 1) / 2) * 0.00028;
      const start = [subsectorLat - 0.0005, routeLng];
      const end = [subsectorLat + 0.00065, routeLng + Math.sin(routeIndex) * 0.00004];

      return {
        ...route,
        start,
        end,
        anchor: [subsectorLat + 0.00075, routeLng]
      };
    });

    return {
      ...subsector,
      center: [subsectorLat, subsectorLng],
      routes: routesWithGeometry
    };
  });
}

export default function SectorLeafletMap({ subsectors = [], locale = 'es' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mapLayout = useMemo(() => buildMapLayout(subsectors), [subsectors]);

  useEffect(() => {
    let cancelled = false;

    ensureLeafletAssets()
      .then((L) => {
        if (cancelled || !mapContainerRef.current) {
          return;
        }

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        const map = L.map(mapContainerRef.current, {
          center: [POTRERO_CENTER.lat, POTRERO_CENTER.lng],
          zoom: 14,
          minZoom: 12
        });

        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.circleMarker([POTRERO_CENTER.lat, POTRERO_CENTER.lng], {
          radius: 8,
          color: '#f97316',
          fillColor: '#fb923c',
          fillOpacity: 0.9,
          weight: 2
        })
          .bindPopup(locale === 'es' ? 'Sector general: Potrero Alto' : 'Main sector: Potrero Alto')
          .addTo(map);

        mapLayout.forEach((subsector, subsectorIndex) => {
          L.circleMarker(subsector.center, {
            radius: 6,
            color: '#14b8a6',
            fillColor: '#2dd4bf',
            fillOpacity: 0.85,
            weight: 2
          })
            .bindPopup(`<strong>${subsectorIndex + 1}. ${subsector.name}</strong>`) 
            .addTo(map);

          subsector.routes.forEach((route, routeIndex) => {
            L.polyline([route.start, route.end], {
              color: '#e2e8f0',
              weight: 3,
              opacity: 0.85
            })
              .bindPopup(
                `<strong>${subsectorIndex + 1}.${routeIndex + 1} ${route.name}</strong><br/>${route.grade ?? ''}`
              )
              .addTo(map);

            L.circleMarker(route.anchor, {
              radius: 4,
              color: '#a78bfa',
              fillColor: '#c4b5fd',
              fillOpacity: 0.9,
              weight: 1
            })
              .bindTooltip(`${subsectorIndex + 1}.${routeIndex + 1} ${route.name}`, { direction: 'top' })
              .addTo(map);
          });
        });
      })
      .catch(() => {
        // Fallback silencioso: el contenedor mantiene texto descriptivo fuera del mapa.
      });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locale, mapLayout]);

  return <div ref={mapContainerRef} className="h-80 w-full md:h-96" aria-label="Mapa interactivo del sector" />;
}
