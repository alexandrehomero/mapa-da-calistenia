import { useState, useEffect, useRef } from 'react';

import { OSM, Vector as VectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { Feature, Map, View } from 'ol/index.js';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';

import styled from 'styled-components';
import process from 'process';
import 'ol/ol.css';

import PocketBase from 'pocketbase' // Import PocketBase instance
import Modal from '../modal';



const MapBlock = () => {
  useGeographic();
  const mapContainerRef = useRef(null);
  const [places, setPlaces] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const pb = new PocketBase(import.meta.env.VITE_API_URL);

  const coordinates = places.map((place) => {
    return [Number(place.longitude), Number(place.latitude)]
  })

  const mapPoints = places.map((place) => {
    const point = new Point([Number(place.longitude), Number(place.latitude)]);
    console.log(point)
    return new Feature({
      geometry: point,
      id: place.id
    });
  });

  const centerPointSum = () => {
    const coordinatesSum = coordinates.reduce((a, b) => {
      return [a[0] + b[0], a[1] + b[1]]
    })
    return [coordinatesSum[0] / coordinates.length, coordinatesSum[1] / coordinates.length]
  }

  const vectorSource = new VectorSource({
    features: mapPoints,
  })


  useEffect(() => {
    pb.collection('places').getList(1, 50, {
      filter: 'created >= "2022-01-01 00:00:00"',
    }).then((e) => {
      setPlaces(e.items)
    })

  }, []);

  useEffect(() => {
    if (mapPoints.length > 0) {

      const map = new Map({
        target: mapContainerRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new VectorLayer({
            source: vectorSource,
            style: {
              'circle-radius': 3,
              'circle-fill-color': 'red',
            },
          }),
        ],
        view: new View({
          center: centerPointSum(),
          zoom: 12,
        }),
      });
      map.on("click", (evt) => {
        openModal()
        let features = vectorSource.getClosestFeatureToCoordinate(evt.coordinate)
        setSelectedPlace(places.find((e) => {return e.id == features.values_.id}))
      })
      return () => {
        map.setTarget(null);

      };
    }

  }, [places]);
  console.log(places)
  if (places.length < 1) {
    return <h1>loading...</h1>
  }
  return (
  <>
    <Container ref={mapContainerRef} />
    <Modal children={selectedPlace && selectedPlace.subtext} selectedPlace={selectedPlace} isOpen={modalOpen} onClose={closeModal}/>
  </>
  )
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

export default MapBlock;