import { View, Text, StyleSheet } from "react-native";
import Button from "@/components/Button"; // Ensure this is wrapped with forwardRef if needed
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import CustomDrawerContent from "@/components/CustomDrawerContent";
import { useNavigation } from '@react-navigation/native';
import RippleButton from "@/components/RippleButton";
import History from "./History";


const Drawer = createDrawerNavigator();

function HomeScreen() {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
     

      <RippleButton title={"START"} navigateTo="inputPage" />
    </View>
  );
}

export default function index() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
         headerStyle: { backgroundColor: 'rgb(62, 131, 115)' },
        drawerLabelStyle: { color: "#3D8D7A", fontSize: 16, fontWeight: "bold" }, // Change text color
        drawerActiveTintColor: "#2e7d32",  // Active text color
        drawerInactiveTintColor: "#A3D1C6", // Inactive text color
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="History" component={History} />


    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#E8F5E9',

  },
});
