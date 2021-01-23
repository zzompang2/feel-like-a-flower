import React from 'react';
import MainScreen from './MainScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import CalenderScreen from './CalenderScreen';

const Tab = createBottomTabNavigator();

export default function ScreenStack() {
  return (
		<Tab.Navigator>
			<Tab.Screen
			name="Main"
			component={MainScreen} />
			{/* <Tab.Screen name="Calender" component={CalenderScreen} /> */}
	</Tab.Navigator>
  );
}