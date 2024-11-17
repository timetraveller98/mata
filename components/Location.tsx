'use client';
import { useState, useEffect } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationDetails {
  state: string;
  district: string;
}

const LocationComponent = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getUserLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => reject(new Error(error.message))
        );
      }
    });
  };

  const fetchLocationDetails = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCrExhH93ias-xUuiskQB5y3z8r9Rea6E8`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;

        const state = addressComponents.find((comp: any) =>
          comp.types.includes('administrative_area_level_1')
        )?.long_name;

        const district = addressComponents.find((comp: any) =>
          comp.types.includes('administrative_area_level_2')
        )?.long_name;

        if (state && district) {
          setLocationDetails({ state, district });
        } else {
          setError('Unable to retrieve state and district from location data.');
        }
      } else {
        throw new Error(`Geocoding API error: ${data.status}`);
      }
    } catch (error:any) {
      setError(error.message || 'Failed to fetch location details');
      console.error(error);
    }
  };

  useEffect(() => {
    getUserLocation()
      .then((coords) => {
        setLocation(coords);
        fetchLocationDetails(coords.latitude, coords.longitude);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      {location ? (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      ) : (
        <p>Loading location...</p>
      )}
      {locationDetails ? (
        <p>
          State: {locationDetails.state}, District: {locationDetails.district}
        </p>
      ) : (
        <p>Loading location details...</p>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default LocationComponent;
