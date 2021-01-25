import React from 'react';
import {
	SafeAreaView,
	View,
	Text,
} from 'react-native';
import SQLite from "react-native-sqlite-storage";
import Flower from '../components/Flower';
import getStyleSheet, { COLORS } from '../values/Styles';

const TAG = 'GardenScreen/';

export default class GardenScreen extends React.Component {
	constructor(props) {
		super(props);

		this.tilesInfo = [];

		for(let i=0; i<7; i++) {
			const row = [];
			for(let j=0; j<7; j++)
			row.push(0);
			this.tilesInfo.push(row);
		}
	}
	
	componentDidMount() {
		console.log("Garden Mount");
	}

	render() {
		const { diaries, emotions, flowers, flowersRequire } = this.props.route.params;

		return(
			<SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
				{/* <Text>Garden</Text> */}

				<View style={{position: 'absolute', alignSelf: 'center'}}>
					{this.tilesInfo.map(row =>
					<View style={{flexDirection: 'row'}}>
						{row.map(info =>
							<View style={{width: 48, height: 48, margin: 1, backgroundColor: COLORS.green1}} />
						)}
					</View>
					)}
					<Flower require={flowersRequire['나팔꽃']} />
				</View>
			</SafeAreaView>
		)
	}
}