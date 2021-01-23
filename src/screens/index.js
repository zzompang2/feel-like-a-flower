import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './MainScreen';
import DiaryScreen from './DiaryScreen';
import GardenScreen from './GardenScreen';
import Navigation from '../components/Navigation';

const Tab = createBottomTabNavigator();

export default function ScreenStack() {
  return (
		<Tab.Navigator
		initialRouteName="Main"
		tabMode={'none'}
		swipeEnabled={false}
		showLabel={true}
		tabBar={({ navigation, state }) => <Navigation navigation={navigation} state={state} />}
		>
			<Tab.Screen name="Diary" component={DiaryScreen} options={{ tabBarLabel: '일기장'}} />
			<Tab.Screen name="Main" component={MainScreen} options={{ tabBarLabel: '달력'}} />
			<Tab.Screen name="Garden" component={GardenScreen} options={{ tabBarLabel: '정원'}} />
		</Tab.Navigator>
  );
}