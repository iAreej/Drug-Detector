import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Redirect, router, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '../Provider/AuthProvider';
import { MaterialIcons } from '@expo/vector-icons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session } = useAuth();

  if (!session) {
    return <Redirect href={'/Auth/Login'} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          headerShown:false,
          href:null,
          headerTransparent: true, // Make header transparent
          
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerLeft: () => (
            <Link href="/" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="chevron-left"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      
      <Tabs.Screen
  name="inputPage"
  options={{
    headerShadowVisible: false,
    headerTransparent: true,
    headerTitle: '',
    headerLeft: () => (
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => ({
          marginLeft: 15,
          opacity: pressed ? 0.5 : 1
        })}
      >
        <MaterialIcons
          name="arrow-back-ios"  // Recommended back icon
          size={24}
          color="#8BC34A"
        />
      </Pressable>
    ),
    // Add tab bar icon configuration
    tabBarIcon: ({ color, size }) => (
      <MaterialIcons
        name="text-fields"  // Example input-related icon
        size={size}
        color={color}
      />
    )
  }}
/>
<Tabs.Screen
  name="outputPage"
  options={{
    headerShown: false,
    // Add tab bar icon configuration
    tabBarIcon: ({ color, size }) => (
      <MaterialIcons
        name="assignment"  // Appropriate icon for output/results
        size={size}
        color={color}
      />
    ),
    // Optional: Add tab bar label styling
    tabBarLabel: "Results",
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '500',
      marginBottom: 2,
    },
    // Optional: Add active/inactive colors
    tabBarActiveTintColor: '#8BC34A',
    tabBarInactiveTintColor: '#888',
  }}
/>

      <Tabs.Screen name='History' options={{
          headerShown:false,
          href:null  }}/>
     
    </Tabs>
  );
}
