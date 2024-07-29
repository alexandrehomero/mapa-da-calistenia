import { useState, useEffect, useRef } from 'react';

import { OSM, Vector as VectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { Feature, Map, View } from 'ol/index.js';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';

import styled from 'styled-components';
import 'ol/ol.css';

import PocketBase from 'pocketbase' // Import PocketBase instance

const MapBlock = () => {
  useGeographic();
  const mapContainerRef = useRef(null);
  const [places, setPlaces] = useState([]);
  const pb = new PocketBase('http://127.0.0.1:8090');
  useEffect(() => {
    pb.collection('places').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00"',
      }).then((e) => {
        setPlaces(e.items)
      })

  }, []);

  const coordinates = places.map((place) => {
    return [Number(place.longitude), Number(place.latitude)]
  })

  const mapPoints = coordinates.map((coordinate) => {
    const point = new Point(coordinate);
    console.log(point)
    point.on(["onclick"], console.log("click"))
    return new Feature(point);
  });

  const centerPoint = coordinates

  useEffect(() => {
    if (mapPoints.length > 0) {
      const map = new Map({
        target: mapContainerRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new VectorLayer({
            source: new VectorSource({
              features: mapPoints,
            }),
            style: {
              'circle-radius': 9,
              'circle-fill-color': 'red',
            },
          }),
        ],
        view: new View({
          center: [-48.2772, -18.9146],
          zoom: 12,
        }),
      });
  
      return () => {
        map.setTarget(null);
      };
    }

  }, [places]);
  console.log(places)
  if (places.length < 1) {
    return <h1>loading...</h1>
  }
  return <Container ref={mapContainerRef} />;
};

const Container = styled.div`
  width: 100%;
  height: 600px;
`;

export default MapBlock;