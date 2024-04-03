import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    IconButton,
    Input,
    SkeletonText,
    Text,
  } from '@chakra-ui/react'
  import { FaLocationArrow,FaTimes,FaSave, } from 'react-icons/fa'
  import axios from 'axios';
  import {
    useJsApiLoader,
    GoogleMap,
    Marker,
  } from '@react-google-maps/api'
  import { useRef, useState, useEffect } from 'react'
  
  let center = { lat: 29.6857, lng: 76.9905 }
  
  function Add() {
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: 'AIzaSyBVzhfAB_XLqaayJkOSuThEdaK4vifdxAI',
      libraries: ['places'],
    })
  
    const [map, setMap] = useState(/** @type google.maps.Map */(null))
    const [markers, setMarkers] = useState([]);
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [policeStations, setPoliceStations] = useState([]);
  
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          center = { lat: position.coords.latitude, lng: position.coords.longitude };
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }, []);
  
    const getNearbyPoliceStations = async () => {
      if (!center) return;
  
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${center.lat},${center.lng}&radius=5000&type=police&key=AIzaSyBVzhfAB_XLqaayJkOSuThEdaK4vifdxAI`
      );
  
      setPoliceStations(response.data.results);
    };

    const handleClick = (e) => {
        setMarkers((current) => [
          ...current,
          {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          },
        ]);
        console.log(markers)
      };
    
    const handleClearMarkers = () => {
        setMarkers([]);
    };
  
  
    useEffect(() => {
      getNearbyPoliceStations();
    }, [center]);
  
    if (!isLoaded) {
      return <SkeletonText />
    }
  
  
    return (
      <Flex
        position='relative'
        flexDirection='column'
        alignItems='center'
        h='100vh'
        w='100vw'
      >
        <Box position='absolute' left={0} top={0} h='90%' w='100%'>
          {/* Google Map Box */}
          <GoogleMap
            center={center}
            zoom={15}
            onClick={handleClick}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={map => setMap(map)}
          >
  
            <Marker position={center} />
            {policeStations.map((station, index) => (
            <Marker
              key={index}
              position={{ lat: station.geometry.location.lat, lng: station.geometry.location.lng }}
              icon={{
                url: 'police-badge.png', // URL of the marker icon
                scaledSize: new window.google.maps.Size(32, 32) // Adjust the size as needed
              }}
              title={station.name}
            />
          ))}
            {markers.map((marker, index) => (
                <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />
            ))}
          </GoogleMap>
        </Box>
        <Box
          p={4}
          borderRadius='lg'
          m={4}
          bgColor='white'
          shadow='base'
          minW='container.md'
          zIndex='1'
        >
          <HStack spacing={4} mt={4} justifyContent='space-between'>
            <Text>Distance: {distance} </Text>
            <Text>Duration: {duration} </Text>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              isRound
              onClick={() => {
                handleClearMarkers();
              }}
            />
            <IconButton
              aria-label='center back'
              icon={<FaLocationArrow />}
              isRound
              onClick={() => {
                map.panTo(center)
                map.setZoom(15)
              }}
            />
            <IconButton
              aria-label='center back'
              icon={<FaSave />}
              isRound
              onClick={() => {
              }}
            />
          </HStack>
        </Box>
      </Flex>
    )
  }
  
  export default Add
  