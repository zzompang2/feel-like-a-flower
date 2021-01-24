import React from 'react';
import {
	SafeAreaView,
	TouchableOpacity,
	View,
	Text,
	FlatList,
} from 'react-native';
import SQLite from "react-native-sqlite-storage";
import getStyleSheet, { COLORS } from '../values/Styles';

const TAG = 'DiaryScreen/';
const db = SQLite.openDatabase({ name: 'FeelLikeAFlower.db' });

export default class DiaryScreen extends React.Component {
	componentDidMount() {
		console.log("Diary Mount");
	}

	findEmotion = (eid) => {
		const { emotions } = this.props.route.params;

		for(let i=0; i < emotions.length; i++) {
			if(emotions[i].eid == eid)
			return emotions[i];
		}
		return {};
	}

	listViewItemSeparator = () => 
	<View style={getStyleSheet().itemSeparator} />

	render() {
		const { diaries, emotions } = this.props.route.params;
		const {
			listViewItemSeparator,
			findEmotion,
		} = this;
		const styles = getStyleSheet();

		return(
			<SafeAreaView style={{flex: 1, backgroundColor: COLORS.green1}}>
				<FlatList
				style={styles.diaryList}
				data={diaries}
				keyExtractor={(item, idx) => idx.toString()}
				ItemSeparatorComponent={listViewItemSeparator}
				renderItem={({ item, index }) =>
				<View style={{marginVertical: 10}}>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<Text style={{color: COLORS.green3, fontWeight: 'bold'}}>{item.date}</Text>
						<View style={{flex: 1, height: 1, backgroundColor: COLORS.green3, marginHorizontal: 8}} />
						<Text style={{color: COLORS.green3, fontWeight: 'bold'}}>{findEmotion(item.emotion).name}</Text>
					</View>
					<View style={{paddingVertical: 8}}>
						<Text style={{color: COLORS.green4, fontSize: 16}}>{item.contents}</Text>
					</View>
				</View>
				} />

			</SafeAreaView>
		)
	}
}