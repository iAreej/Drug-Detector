import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image , Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../lib/superbase';
import Button from '@/components/Button';
import {  useRouter } from "expo-router";
import { useUser } from '../Provider/UserProvider';


const Signup = () => {
  const { setUserId } = useUser();  // Get the `setUserId` function
  const [selectedType, setSelectedType] = useState<'Admin' | 'User'>('User');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[loading, setloading]=useState(false)
  const router = useRouter(); 


const SignUpWithEmail=async ()=>{
setloading(true)
console.log("/nPressed")
//const {  error } = await supabase.auth.signUp({ email, password });
  
 //Sign up the user
 const {data, error } = await supabase.auth.signUp({
  email,
  password,
});
if (error) {
        Alert.alert("Error", error.message);
      }

if (data?.user) {
  setUserId(data.user.id); // Set the userId in context

  // After sign-up, update the user profile with the selected role (type)
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert(
      [{ id: data.user.id, group: selectedType }], // selectedType is the role (e.g., 'Admin', 'User')
      { onConflict: 'id' } // Ensures no duplicate rows
    );

  if (upsertError) {
    Alert.alert("Error updating role", upsertError.message);
    setloading(false);
    return;
  }

  console.log(email, password, data.user.id);

  // Step 3: Navigate to the next page and pass user id
  router.push({
    pathname: './Signup2', // Your next page
   // params: { userId: data.user.id }, // Passing user ID for further updates
  });


}

setloading(false)

}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Account Type</Text>

      <View style={styles.accountTypeContainer}>
        <TouchableOpacity
          style={[styles.option, selectedType === 'Admin' && styles.selectedOption]}
          onPress={() => setSelectedType('Admin')}
        >
          <Image
            source={{ uri: 'https://th.bing.com/th/id/OIP.ySubp3CmljMzhtygbvfqewHaHa?w=512&h=512&rs=1&pid=ImgDetMain' }} // Replace with actual image URL for Doctor
            style={styles.image}
          />
          <Text style={styles.optionText}>Admin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selectedType === 'User' && styles.selectedOption]}
          onPress={() => setSelectedType('User')}
        >
          <Image
            source={{ uri: 'https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_1280.png' }} // Replace with actual image URL for Patient
            style={styles.image}
          />
          <Text style={styles.optionText}>User</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.welcomeText}>
        Hello {selectedType.toLowerCase()}!
        {'\n'}
        Please fill out the form below to get started
      </Text>
      <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
      <Icon name="user" size={20} color="#8BC34A" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      </View>

      <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#8BC34A" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      </View>
      </View>
      <Button style={styles.loginButton} onPress={SignUpWithEmail} disabled={loading} 
            text= {loading? 'Creating Account...':'Create Account'}/>





      <View style={styles.socialLoginContainer}>
        <View style={styles.socialIcons}>
          <Icon name="instagram" size={30} color="#8BC34A" />
          <Icon name="facebook" size={30} color="#8BC34A" style={styles.socialIcon} />
          <Icon name="twitter" size={30} color="#8BC34A" style={styles.socialIcon} />
        </View>
      </View>





    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '5%', // Adjust padding relative to the screen size
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15, // Add some spacing

  },
  formContainer: {
    width: '90%', // Adjust to occupy 90% of the screen width
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: '5%',
    textAlign: 'center',
  },
  accountTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: '5%',
  },
  option: {
    alignItems: 'center',
    padding: '5%',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#ccc',
    width: '45%', // Use relative width for responsiveness
  },
  selectedOption: {
    borderColor: '#8BC34A',
  },
  image: {
    width: '100%', // Make image width responsive
    height: undefined,
    aspectRatio: 3 / 4, // Maintain aspect ratio for images
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: '5%',
  },
  input: {
    flex: 1, // Make input take the remaining space in the row
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    width:'100%',

  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: '5%',
  },
  forgotText: {
    color: '#00f',
  },
  loginButton: {
    backgroundColor: '#8BC34A',
    padding: '4%',
    borderRadius: 5,
    width: '100%', // Make the button span full width of the container
    alignItems: 'center',
    marginBottom: '5%',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
  },
  signupText: {
    color: 'black',
    marginTop: '2%',
    marginLeft:'90%',

  },
  socialLoginContainer: {
    alignItems: 'center',
  },
  socialLoginText: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
    
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%', // Use percentage for the container
  },
  socialIcon: {
    marginLeft: 15,
  },
  icon:{
    marginRight:5,
    marginLeft:0.
  }
});


export default Signup;
