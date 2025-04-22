import React, { useState } from "react";
import { View,Text,TextInput,StyleSheet,TouchableOpacity,Alert,Switch,ScrollView,Platform,PermissionsAndroid,} from "react-native";
// import Geolocation from "react-native-geolocation-service";
import * as Location from 'expo-location';
import { useResponse } from "../Provider/ResProvider";
import { useUser } from "../Provider/UserProvider";
import { supabase } from "../lib/superbase";
import { router } from "expo-router";

export default function outputPage() {
  const { response } = useResponse();
  const [name, setName] = useState(""); // Dynamic name if needed
  const [CNIC, setCNIC] = useState(""); // Dynamic CNIC if needed
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [additionalNote, setAdditionalNote] = useState<string>("");
  const [shareLocation, setShareLocation] = useState<boolean>(false);
  const { userId } = useUser();  // Access the userId from the context
console.log("on output page " + userId)  



// Request location permission
const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};








// Send location to Supabase
const sendLocationToSupabase = async (latitude, longitude) => {
  const { data, error } = await supabase
    .from('Location') // Assuming 'locations' table exists in Supabase
    .insert([{ latitude, longitude, user_id: userId  // Assuming you have the userId available
    }]);

  if (error) {
    console.error('Error inserting location:', error);
    Alert.alert('Error', 'Failed to save location.');
  } else {
    console.log('Location saved:', data);
    Alert.alert('Location saved!', `Lat: ${latitude}, Lon: ${longitude}`);
  }
};




// Toggle Location Fetching
const toggleLocationSwitch = async (value) => {
  setIsLocationEnabled(value);

  if (value) {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      try {
        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
        Alert.alert("Location fetched!", `Lat: ${latitude}, Lon: ${longitude}`);
        
        // Send the location to your database or API
        sendLocationToSupabase(latitude, longitude);
      } catch (error) {
        Alert.alert("Error", `Failed to get location: ${error.message}`);
      }
    } else {
      Alert.alert("Permission Denied", "Location permission is required to fetch location.");
    }
  } else {
    setLocation(null);
  }
};



//fetching username 
const getUserName = async () => {
  const { data, error } = await supabase
    .from('profiles') // your users table
    .select('username') // or whatever the column is
    .eq('id', userId) // or whatever the ID column is
    .single();

  if (error) {
    console.error('Error fetching user name:', error);
    return null;
  }

  return data.username;
};


  const sendResponse = () => {
    Alert.alert("Confirm", "Are you sure you want to send the response?", [
      { text: "Cancel" },
      {
        text: "Send",
        style: "destructive",
        onPress: onSend,
      },
    ]);
  };

  
  const onSend = async () => {

    if (!response) {
      Alert.alert(
        "No drug detected",
        "Please try again.",
        [
          { 
            text: "OK", 
            onPress: () => router.replace('/') // Replace with your home route if different
          }
        ]
      );
      return;
    }

    // Check if location is shared or location fetching is not enabled


           // Fetch user name
           const reporterName = await getUserName(); 
           if (!reporterName) {
             Alert.alert("Error", "Failed to fetch user name.");
             return;
           }



 // Validate CNIC length (13 digits)
 if (CNIC.length !== 13) {
  Alert.alert("Error", "CNIC must be exactly 13 digits.");
  return;
}

// Validate Phone Number length (11 digits)
if (phoneNumber.length !== 11) {
  Alert.alert("Error", "Phone number must be exactly 11 digits.");
  return;
}



    if (location || !shareLocation) {
      console.log("Sending response...");

      console.log({ name,CNIC, phoneNumber,additionalNote,reporterName  });
  
      try {
        // If location is shared, insert location data first
        if (shareLocation && location) {
          // Insert location data into the Location table
          const { data: locationData, error: locationError } = await supabase
            .from('Location')  // Assuming 'Location' is your table name
            .insert([{
              latitude: location.latitude,
              longitude: location.longitude,
              user_id: userId,  // Add the userId in the location record
            }]);
  
          if (locationError) {
            console.error('Error inserting location:', locationError);
            Alert.alert('Error', 'Failed to save location.');
            return; // Stop execution if location fails to save
          }
          console.log('Location saved:', locationData);
        } 
          }catch (error) {
          console.error('Error:', error);
          Alert.alert('Error', 'An unexpected error occurred.');
        }

      
        }  
  


        // Now insert addict data (even if location was not shared)
        const { data: addictData, error: addictError } = await supabase
          .from('addict')  // Assuming 'addict' is your table name
          .insert([{
            reported_by: userId,  // assuming userId is the person reporting
            addict_name: name,
            phone: phoneNumber,
            additional_note: additionalNote,
            CNIC: CNIC,
            Drug: response,
            reporter_name:reporterName,
          }]);
  
        if (addictError) {
          console.error('Error inserting addict data:', addictError);
          Alert.alert('Error', 'Failed to save addict details.');
          return; // Stop execution if addict data fails to save
        }
  
        console.log('Addict data saved:', addictData);
        Alert.alert('Success', 'Report sent successfully!');

        router.push('./'); 

      } 
      
    

    
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.resultText}>
          RESULT: <Text style={styles.dangerText}>{response}</Text>
        </Text>
        
      </View>

      {/* User Details */}
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Name"
          value={name}
          onChangeText={setName}
        />


        <Text style={styles.label}>CNIC</Text>
        <TextInput
          style={styles.input}
          placeholder="xxxx-xxxxx-xx"
          value={CNIC}
          onChangeText={setCNIC}
        />
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.label}>Additional Note</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Additional Note"
          value={additionalNote}
          onChangeText={setAdditionalNote}
          multiline
        />
      </View>

      {/* Share Location Toggle */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Share Location</Text>
        <Switch
          value={isLocationEnabled}
          onValueChange={toggleLocationSwitch}
          trackColor={{ false: "#767577", true: "#32CD32" }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.button} onPress={sendResponse}>
        <Text style={styles.buttonText}>Share Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E8F5E9',


  },
  header: {
    marginBottom: 16,
    alignItems: "center",
  },
  resultText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  dangerText: {
    color: "red",
  },
  dateText: {
    fontSize: 20,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  label: {
    fontSize: 20,
    color: "#333",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 17,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "rgb(26, 143, 116)",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
