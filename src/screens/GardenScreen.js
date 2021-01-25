import React from 'react';
import {
	SafeAreaView,
	View,
	Text,
	Animated,
} from 'react-native';
import SQLite from "react-native-sqlite-storage";
import Flower from '../components/Flower';
import getStyleSheet, { COLORS } from '../values/Styles';

const TAG = 'GardenScreen/';
const db = SQLite.openDatabase({ name: 'FeelLikeAFlower.db' });

export default class GardenScreen extends React.Component {
	constructor(props) {
		super(props);

		const { diaries, emotions, flowers, flowersRequire } = props.route.params;

		this.state = {
			diaries: diaries,
		};

		this.flowersBlank = [];
		for(let i=0; i<diaries.length; i++) {
			console.log({ x: diaries[i].x, y: diaries[i].y });
			this.flowersBlank.push({ x: diaries[i].x, y: diaries[i].y });
		}

		// Tile 정보
		this.tilesInfo = [];

		for(let i=0; i<7; i++) {
			const row = [];
			for(let j=0; j<7; j++)
			row.push(0);
			this.tilesInfo.push(row);
		}
	}

	changeFlowerPos = (idx, newX, newY) => {
		const { diaries } = this.state;

		for(let i=0; i<diaries.length; i++) {
			if(i != idx && diaries[i].x == newX && diaries[i].y == newY)
			return;
		}

		this.flowersBlank.splice(idx, 1, { x: newX, y: newY });
		const newDiary = {...diaries[idx], x: newX, y: newY };
		const newDiaries = [...diaries.slice(0, idx), newDiary, ...diaries.slice(idx+1)];

		this.setState({ diaries: newDiaries });

		db.transaction(txn => {
			txn.executeSql(
				"UPDATE diaries " +
				"SET x=?, y=? " +
				"WHERE id=?",
				[newX, newY, diaries[idx].id]);
		},
		e => console.log("DB ERROR", e),
		() => console.log("DB SUCCESS"));
	}

	findFlowerName = (fid) => {
		const { flowers } = this.props.route.params;

		for(let i=0; i < flowers.length; i++) {
			if(flowers[i].fid == fid)
			return flowers[i].name;
		}
		return "?";
	}
	
	componentDidMount() {
		console.log("Garden Mount");
	}

	render() {
		const { emotions, flowers, flowersRequire } = this.props.route.params;
		const { diaries } = this.state;
		const {
			findFlowerName,
			changeFlowerPos,
		} = this;

		return(
			<SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
				{/* <Text>Garden</Text> */}

				<View style={{position: 'absolute', alignSelf: 'center'}}>
					{this.tilesInfo.map((row, idx) =>
					<View key={idx} style={{flexDirection: 'row'}}>
						{row.map((info, idx) =>
							<View key={idx} style={{width: 48, height: 48, margin: 1, backgroundColor: COLORS.green1}} />
						)}
					</View>
					)}
					{diaries.map((diary, idx) =>
					<Flower
					key={idx}
					id={idx}
					require={flowersRequire[findFlowerName(diary.fid)]}
					flowerBlank={this.flowersBlank[idx]}
					changeFlowerPos={changeFlowerPos} />
					)}
				</View>
			</SafeAreaView>
		)
	}
}