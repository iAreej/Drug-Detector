import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Link, Redirect, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/app/lib/superbase';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const router = useRouter(); // Get the router instance


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(`Logout failed: ${error.message}`);
    } else {
      alert('You have been logged out successfully.');
      router.replace('/Auth/Login'); // Use router navigation instead of Redirect

    }
  };

  return (
    <DrawerContentScrollView 
    {...props} 
    contentContainerStyle={styles.drawerContainer}
  >
    {/* Drawer Items with proper props */}
    <DrawerItemList 
      {...props}
    />
      
      {/* Logout Button Container */}
      <View style={styles.footer}>
        <Pressable 
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressedButton
          ]}
          onPress={handleLogout}
        >
          <MaterialIcons name="exit-to-app" size={24} color="#ef5350" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#E8F5E9',

  },
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#ffebee',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef5350',
  },
  pressedButton: {
    opacity: 0.7,
    backgroundColor: '#ffcdd2',
    
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
    // Add other text styles if needed
  },
});

export default CustomDrawerContent;