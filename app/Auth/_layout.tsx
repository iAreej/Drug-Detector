import { FontAwesome } from '@expo/vector-icons';
import {Link, Stack} from 'expo-router'
import { Pressable } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
export default function MenuStack(){
return  (   <Stack>

  
<Stack.Screen 
  name="Signup" 
  options={{
   
    headerTitle: 'Welcome to Signup Page',
    headerStyle: {
      backgroundColor: 'rgba(139, 195, 74, 0.8)', // Semi-transparent version of #8BC34A
    },
    
    headerLeft: () => (
      <Link href="./Login" asChild>
        <Pressable>
          {({ pressed }) => (
            <FontAwesome
              name="arrow-left"
              size={25}
              color="white"
              style={{ 
                marginLeft: 0,
                opacity: pressed ? 0.5 : 1,
                backgroundColor: 'rgba(253, 248, 248, 0.3)',
                borderRadius: 20,
                padding: 8
              }}
            />
          )}
        </Pressable>
      </Link>
    ),
  }}
/>

<Stack.Screen name="Signup2" options={{
  headerShadowVisible: false,
  headerTransparent: true,
    headerTitle: '',
    headerLeft: () => (
     <Link href="/" asChild>
    <Pressable>
      {({ pressed }) => (
        <FontAwesome
          name="chevron-left"
          size={25}
          color={Colors.light.tint}
          style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
        />
      )}
    </Pressable>
  </Link>
),
} } />
    <Stack.Screen name="Login" 
    options={{title: 'Login Page',
      headerShown:false,
     }} />

    </Stack>
           );   
           
}


