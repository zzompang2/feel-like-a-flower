import React from 'react';
import {
	View,
	Text,
} from 'react-native';
import SQLite from "react-native-sqlite-storage";
import getStyleSheet from '../values/Styles';

const TAG = 'DiaryScreen/';
const db = SQLite.openDatabase({ name: 'FeelLikeAFlower.db' });

export default class DiaryScreen extends React.Component {

	render() {
		return(
			<View style={{flex: 1}}>
				<Text>Diary</Text>
			</View>
		)
	}
}