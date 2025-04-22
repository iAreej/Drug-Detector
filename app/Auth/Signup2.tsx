import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../lib/superbase';
import { router, useLocalSearchParams } from "expo-router";
import { useUser } from '../Provider/UserProvider';
import {  useRouter } from "expo-router";

const Signup2 = () => {
  
  const { userId } = useUser();  // Access the userId from the context
  const router = useRouter(); 
  const [instituteName, setInstitute] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const[userName,setname]=useState('')
  const [cnic, setCnic] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!instituteName || !phoneNumber || !cnic) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

     // Validate CNIC length (13 digits)
     if (cnic.length !== 13) {
      Alert.alert("Error", "CNIC must be exactly 13 digits.");
      return;
    }

    // Validate Phone Number length (11 digits)
    if (phoneNumber.length !== 11) {
      Alert.alert("Error", "Phone number must be exactly 11 digits.");
      return;
    }

    setLoading(true);

    try {
      // Update the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          institute_name: instituteName, // Use correct column names from your database
          phone: phoneNumber,
          username:userName,
          cnic: cnic,
        })
        .eq('id', userId);

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", "Successfully Registered");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
      router.push({
        pathname: './Login', // Your next page
      });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Final step to join our community</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Institute Name */}
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Icon name="university" size={18} color="#fff" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Institute Name"
            placeholderTextColor="#a8a8a8"
            value={instituteName}
            onChangeText={setInstitute}
          />
        </View>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Icon name="user" size={18} color="#fff" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#a8a8a8"
            value={userName}
            onChangeText={setname}
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Icon name="mobile" size={22} color="#fff" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#a8a8a8"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* CNIC */}
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Icon name="id-card" size={18} color="#fff" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="CNIC"
            placeholderTextColor="#a8a8a8"
            value={cnic}
            onChangeText={setCnic}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleUpdate}
          activeOpacity={0.9}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>
              {loading ? 'Processing...' : 'Complete Registration'}
            </Text>
            <Icon name="arrow-right" size={18} color="#fff" style={styles.buttonIcon} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#f8fff8',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: '#8BC34A',
    borderRadius: 8,
    padding: 10,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 30,
    borderRadius: 12,
    backgroundColor: '#8BC34A',
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  buttonIcon: {
    marginTop: 2,
  },
});
export default Signup2;
