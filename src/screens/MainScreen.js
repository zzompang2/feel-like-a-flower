import React from 'react';
import {
	SafeAreaView,
	View,
	Text,
	TouchableOpacity,
	Alert,
	TextInput,
	Keyboard,
	Animated,
} from 'react-native';
import SQLite from "react-native-sqlite-storage";
import getStyleSheet, { COLORS } from '../values/Styles';

const TAG = 'MainScreen/';
const db = SQLite.openDatabase({ name: 'FeelLikeAFlower.db' });

export default class MainScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			diaries: [],
			emotions: [],
			emotionBtnEnable: false,									// 기분 추가하기 버튼을 보이게 할 것인가
		};

		this.logoOpacity = new Animated.Value(1);		// 로고 불투명도
		this.logoDisappear = false;									// 로고 안 보이는지 여부
	};

	getDatabaseData() {
		const diaries = [];
		const emotions = [];

		db.transaction(txn => {
			/*=== 기존 TABLE 초기화(for debug) ===*/
			txn.executeSql('DROP TABLE IF EXISTS diaries');
			txn.executeSql('DROP TABLE IF EXISTS emotions');

			/*=== TABLE 생성 ===*/
			txn.executeSql(
				'CREATE TABLE IF NOT EXISTS diaries(' +
				'id INTEGER NOT NULL, ' +
				'date TEXT NOT NULL, ' +
				'editDate TEXT NOT NULL, ' +
				'emotion INTEGER NOT NULL, ' +
				'content TEXT NOT NULL, ' +
				'PRIMARY KEY(id))'
			);

			txn.executeSql(
				'CREATE TABLE IF NOT EXISTS emotions(' +
				'eid INTEGER NOT NULL, ' +
				'name TEXT NOT NULL, ' +
				'type INTEGER NOT NULL, ' +
				'PRIMARY KEY(eid))'
			);

			// DB 에서 note 정보 가져오기
			txn.executeSql(
				"SELECT * FROM diaries",
				[],
        (txn, result) => {
					// note 정보 가져오기
					for (let i = 0; i < result.rows.length; i++)
					diaries.push(result.rows.item(i));

					txn.executeSql(
						"SELECT * FROM emotions",
						[],
						(txn, result) => {
							// note 정보 가져오기
							for (let i = 0; i < result.rows.length; i++)
							emotions.push(result.rows.item(i));

							this.setState({ diaries, emotions });
						}
					);
				}
			);
		},
		e => console.log("DB ERROR", e),
		() => console.log("DB SUCCESS"));
	}

	/* Date() 로 받은 날짜 값을 YYYY.MM.DD 포멧의 string 으로 변경 */
	getTodayDate() {
		const date = new Date();
		return `${date.getFullYear()}.` +
					 `${(date.getMonth() < 9 ? '0' : '') + (date.getMonth()+1)}.` +
					 `${(date.getDate() < 10 ? '0' : '') + date.getDate()}`;
	}

	/* Date() 로 받은 시간 값을 HH:MM 포멧의 string 으로 변경 */
	getTodayTime() {
		const date = new Date();
		return `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:` +
					 `${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
	}

	/* Date() 로 받은 날짜 값으로 YYYYMMDD 숫자를 만든다 */
	getTodayDiaryId() {
		const date = new Date();
		const stringId = `${date.getFullYear()}` +
					 					`${(date.getMonth() < 9 ? '0' : '') + (date.getMonth()+1)}` +
										 `${(date.getDate() < 10 ? '0' : '') + date.getDate()}`;
		return Number(stringId);
	}

	/**
	 * this.contents 데이터를 업데이트 하고
	 * 로고 불투명도 / 기분 추가 버튼 활성화 여부를 결정한다.
	 * @param {string} text contents input 에 들어온 텍스트
	 */
	onChangeContents = (text) => {
		const { emotionBtnEnable } = this.state;
		const contents = text.trim();
		this.contents = contents;

		if(emotionBtnEnable && contents.length == 0)
		this.setState({ emotionBtnEnable: false });
		else if(!emotionBtnEnable && contents.length > 0)
		this.setState({ emotionBtnEnable: true });

		if(contents.length > 0 && !this.logoDisappear) {
			this.logoDisappear = true;
			Animated.timing(
				this.logoOpacity,
				{
					toValue: 0,
					duration: 1000,
					useNativeDriver: true,
				}
			).start();
		}
		else if(contents.length == 0 && this.logoDisappear) {
			this.logoDisappear = false;
			Animated.timing(
				this.logoOpacity,
				{
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
				}
			).start();
		}
	}

	addDiary = () => {
		console.log("다이어리 추가");
	}

	componentDidMount() {
		this.getDatabaseData();
	}

	render() {
		const { emotionBtnEnable } = this.state;
		const { getTodayDate, onChangeContents, addDiary } = this;
		const styles = getStyleSheet();

		this.logoOpacityStyle = { opacity: this.logoOpacity };
		this.btnOpacityStyle = { opacity: Animated.add(1, Animated.multiply(-3, this.logoOpacity)) };

		return(
			<SafeAreaView style={styles.bg}>
			<TouchableOpacity
			style={[styles.bg, {padding: 20}]}
			onPress={() => Keyboard.dismiss()}
			activeOpacity={1}>

				{/* 상단 바 */}
				<View style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					paddingBottom: 5}}>
					<Text style={styles.main__topText}>{getTodayDate()}</Text>
					<TouchableOpacity
					onPress={() => addDiary()}>
						<Text style={styles.main__topText}>그만 써야겠어</Text>
					</TouchableOpacity>
				</View>

				{/* contents 입력란 */}
				<TextInput 
				style={styles.contentsInput}
				maxLength={200}
				multiline={true}
				autoCorrect={false}
				placeholder="오늘 참.."
				placeholderTextColor={COLORS.gray}
				ref={ref => this.contentsInput = ref}
				onChangeText={text => onChangeContents(text)} />

				{/* 기분 추가 버튼 */}
				{emotionBtnEnable ?
				<Animated.View
				style={[this.btnOpacityStyle, {flexDirection: 'row'}]}>
					<TouchableOpacity
					activeOpacity={.8}
					style={styles.main__emotionBtn}>
						<Text style={styles.main__emotionBtn__text}>{'+ 기분 태그달기'}</Text>
					</TouchableOpacity>
				</Animated.View>
				: null}

				{/* 로고 */}
				<Animated.View
				pointerEvents='none'
				style={[
					{
						position: 'absolute',
						width: '100%',
						height: '100%',
						alignItems: 'center',
						justifyContent: 'center'
					},
					this.logoOpacityStyle
				]}>
					<Text style={styles.logo}>기분 꽃 같네</Text>
				</Animated.View>

			</TouchableOpacity>
			</SafeAreaView>
		)
	}
}