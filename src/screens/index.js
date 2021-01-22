import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './MainScreen';

const Stack = createStackNavigator();

export default function ScreenStack() {
  return (
		<Stack.Navigator
		initialRouteName="Main"
		headerMode={'none'}>
      <Stack.Screen name="Main" component={MainScreen} />
    </Stack.Navigator>
  );
}