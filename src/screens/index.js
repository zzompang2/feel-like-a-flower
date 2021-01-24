import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from './SplashScreen';
import CalenderScreen from './CalenderScreen';
import DiaryScreen from './DiaryScreen';
import GardenScreen from './GardenScreen';
import Navigation from '../components/Navigation';

const StackTab = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function ScreenStack() {
  return (
		<StackTab.Navigator
		headerMode='none'
		screenOptions={{gestureEnabled: false}} 	// swipe 로 goBack 하는 것 막기
		screenOptions={{animationEnabled: false}}	// 이동시 좌우 슬라이드 애니메이션 없애기
		>
			<StackTab.Screen name="Splash" component={SplashScreen} />
			<StackTab.Screen name="Main">
				{() =>
				<BottomTab.Navigator
				initialRouteName="Main"
				tabMode={'none'}
				swipeEnabled={false}
				showLabel={true}
				tabBar={({ navigation, state }) => <Navigation navigation={navigation} state={state} />}
				>
					<BottomTab.Screen name="Diary" component={DiaryScreen} options={{ tabBarLabel: '일기장'}} />
					<BottomTab.Screen name="Calender" component={CalenderScreen} options={{ tabBarLabel: '달력'}} />
					<BottomTab.Screen name="Garden" component={GardenScreen} options={{ tabBarLabel: '정원'}} />
				</BottomTab.Navigator>
				}
			</StackTab.Screen>
		</StackTab.Navigator>
  );
}