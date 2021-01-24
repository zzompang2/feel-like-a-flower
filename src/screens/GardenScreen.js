import React from 'react';
import {
	View,
	Text,
} from 'react-native';
import SQLite from "react-native-sqlite-storage";
import getStyleSheet from '../values/Styles';

const TAG = 'GardenScreen/';
const db = SQLite.openDatabase({ name: 'FeelLikeAFlower.db' });

export default class GardenScreen extends React.Component {
	componentDidMount() {
		console.log("Garden Mount");
	}

	render() {
		return(
			<View style={{flex: 1}}>
				<Text>Garden</Text>
			</View>
		)
	}
}