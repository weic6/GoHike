// client/src/components/Map.jsx
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// Access the token from the environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const Map = ({ hikes }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-103.5917, 40.6699],
      zoom: 3,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    if (hikes && hikes.features) {
      map.on("load", () => {
        map.addSource("hikes", {
          type: "geojson",
          data: hikes,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });

        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "hikes",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#caf0f8",
              10,
              "#00b4d8",
              30,
              "#03045e",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              15,
              10,
              20,
              30,
              25,
            ],
          },
        });

        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "hikes",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });

        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "hikes",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#11b4da",
            "circle-radius": 4,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
          },
        });

        map.on("click", "clusters", (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          });
          const clusterId = features[0].properties.cluster_id;
          map
            .getSource("hikes")
            .getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;
              map.easeTo({ center: features[0].geometry.coordinates, zoom });
            });
        });

        map.on("click", "unclustered-point", (e) => {
          const { popUpMarkup } = e.features[0].properties;
          const coordinates = e.features[0].geometry.coordinates.slice();
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popUpMarkup)
            .addTo(map);
        });

        map.on("mouseenter", "clusters", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "clusters", () => {
          map.getCanvas().style.cursor = "";
        });
      });
    }

    return () => map.remove();
  }, [hikes]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "400px" }} />
  );
};

export default Map;
