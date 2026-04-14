'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import maplibregl, { LngLatBounds } from 'maplibre-gl';
import { WaterBody } from '@/types';

const DEFAULT_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
};

export function MapSelector({
  waterBodies,
  selectedId,
  onSelect,
}: {
  waterBodies: WaterBody[];
  selectedId?: string;
  onSelect: (waterBodyId: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const isMapReadyRef = useRef(false);

  const validBodies = useMemo(
    () => waterBodies.filter((item) => item.latitude != null && item.longitude != null),
    [waterBodies],
  );

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  }, []);

  const syncMap = useCallback(() => {
    const map = mapRef.current;

    if (!map) return;
    if (!isMapReadyRef.current) return;
    if (!map.isStyleLoaded()) return;

    clearMarkers();

    validBodies.forEach((waterBody) => {
      const markerElement = document.createElement('button');
      markerElement.className =
        waterBody.id === selectedId ? 'map-marker is-selected' : 'map-marker';
      markerElement.type = 'button';
      markerElement.title = waterBody.name;
      markerElement.addEventListener('click', () => onSelect(waterBody.id));

      const marker = new maplibregl.Marker({ element: markerElement })
        .setLngLat([Number(waterBody.longitude), Number(waterBody.latitude)])
        .setPopup(
          new maplibregl.Popup({ offset: 20 }).setHTML(`
            <div style="font-family: Arial, sans-serif; min-width: 160px;">
              <strong>${waterBody.name}</strong><br />
              <span>${waterBody.district || 'Без района'}</span>
            </div>
          `),
        )
        .addTo(map);

      markersRef.current.push(marker);
    });

    if (validBodies.length === 1) {
      const waterBody = validBodies[0];
      map.flyTo({
        center: [Number(waterBody.longitude), Number(waterBody.latitude)],
        zoom: 8,
        essential: true,
      });
      return;
    }

    if (validBodies.length > 1) {
      const bounds = new LngLatBounds();

      validBodies.forEach((waterBody) => {
        bounds.extend([Number(waterBody.longitude), Number(waterBody.latitude)]);
      });

      map.fitBounds(bounds, {
        padding: 60,
        maxZoom: 8,
        duration: 0,
      });
    }
  }, [clearMarkers, onSelect, selectedId, validBodies]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: DEFAULT_STYLE,
      center: [68.0, 48.0],
      zoom: 4,
    });

    mapRef.current = map;
    isMapReadyRef.current = false;

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    const handleLoad = () => {
      isMapReadyRef.current = true;
      syncMap();
    };

    map.on('load', handleLoad);

    return () => {
      isMapReadyRef.current = false;
      clearMarkers();
      map.off('load', handleLoad);
      map.remove();
      mapRef.current = null;
    };
  }, [clearMarkers, syncMap]);

  useEffect(() => {
    syncMap();
  }, [syncMap]);

  return <div ref={containerRef} className="map-surface" />;
}