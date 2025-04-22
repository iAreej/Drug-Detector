import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import { forwardRef } from 'react';

type ButtonProps = {
  text: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, ...pressableProps }, ref) => {
    return (
      <Pressable ref={ref} {...pressableProps} style={styles.container}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8BC34A',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  
  },
  
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default Button;