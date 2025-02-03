import { useState, useEffect } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";

export const useRequestLocationPermission = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS !== "android") return; // Skip for iOS

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission Required",
          message: "Give me your location or else",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert("Permission Denied", "GIVE ME YOUR LOCATION!!!!");
      }
    };

    const getCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
          Alert.alert("Error", "Unable to retrieve location.");
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    };

    requestLocationPermission();
  }, []);

  return location; 
};



