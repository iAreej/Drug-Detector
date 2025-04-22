import { supabase } from "@/app/lib/superbase";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import Icon from 'react-native-vector-icons/FontAwesome'; // FontAwesome icon

export default function MapPage() {
  const [locations, setLocations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from("Location")
          .select("latitude, longitude");

        if (error) {
          throw new Error(error.message);
        }

        setLocations(data);
        if (data.length > 0) {
          setRegion({
            latitude: data[0].latitude,
            longitude: data[0].longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch locations.");
      }
    };

    fetchLocations();
  }, []);

  const handleNextMarker = () => {
    if (locations.length === 0) return;

    const nextIndex = (currentIndex + 1) % locations.length;
    setCurrentIndex(nextIndex);
    setRegion({
      latitude: locations[nextIndex].latitude,
      longitude: locations[nextIndex].longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  if (!region) {
    return (
      <View style={styles.container}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {locations.length > 0 && (
          <Marker
  coordinate={{
    latitude: locations[currentIndex].latitude,
    longitude: locations[currentIndex].longitude,
  }}
  title={`Location ${currentIndex + 1}`}
  description="Drug detection point"
  pinColor="red" // Optional for a built-in color
>
  {/* Custom Icon */}
  <Callout>
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* Warning Triangle Icon */}
      <Icon name="exclamation-triangle" size={50} color="yellow" />
      
      {/* Label Text */}
      <Text style={{ color: 'black', fontWeight: 'bold', marginTop: 5 }}>
        Drug Detection Point
      </Text>
    </View>
  </Callout>
</Marker>

        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Next Marker" onPress={handleNextMarker} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  markerTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  markerText: {
    fontSize: 12,
    color: 'red', // You can customize the text color
  },
 
});
