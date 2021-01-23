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
	ScrollView,
	Image,
	ImageBackground,
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
			emotionItemEnable: false,
			selectedEmotion: {eid: -1},
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
				'contents TEXT NOT NULL, ' +
				'PRIMARY KEY(id))'
			);

			txn.executeSql(
				'CREATE TABLE IF NOT EXISTS emotions(' +
				'eid INTEGER NOT NULL, ' +
				'name TEXT NOT NULL, ' +
				'type INTEGER NOT NULL, ' +
				'PRIMARY KEY(eid))'
			);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [-1, '없음', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [0, '행복', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [1, '기대', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [2, '기쁨', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [3, '절망', 1]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [4, '슬픔', 1]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [5, '애매모호', 2]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [6, '인내', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [7, '아름다움', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [8, '승리', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [9, '절망', 1]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [10, '슬픔', 1]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [11, '애매모호', 2]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [12, '인내', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [13, '아름다움', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [14, '승리', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [20, '행복', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [21, '기대', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [22, '기쁨', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [23, '절망', 1]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [24, '슬픔', 1]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [25, '애매모호', 2]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [26, '인내', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [27, '아름다움', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [28, '승리', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [29, '절망', 1]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [210, '슬픔', 1]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [211, '애매모호', 2]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [212, '인내', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [213, '아름다움', 0]);

			txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [124, '승리', 0]);

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
		this.setState({ emotionBtnEnable: false, emotionItemEnable: false });
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

	selectEmotion = (emotion) => {
		const { selectedEmotion } = this.state;
		if(selectedEmotion.eid == emotion.eid)
		this.setState({ selectedEmotion: {eid: -1} });
		else
		this.setState({ selectedEmotion: emotion });
	}

	addDiary = () => {
		const { diaries, selectedEmotion } = this.state;
		const id = this.getTodayDiaryId();
		const date = this.getTodayDate();

		Keyboard.dismiss();
		if(this.contents == undefined || this.contents == '')
		Alert.alert("일기장 내용", "오늘 기분이 어떠신가요? ^__^",
		[{ text: '적어볼게요' }]);

		else {
			const newDiaries = [...diaries, { id, date, editDate: date, emotion: this.emotion, contents: this.contents }];

			this.setState({ diaries: newDiaries });

			db.transaction(txn => {
				txn.executeSql(
					"INSERT INTO diaries VALUES (?, ?, ?, ?, ?)",
					[id, date, date, selectedEmotion.eid, this.contents]
				);
			},
			e => console.log("DB ERROR", e),
			() => console.log("DB SUCCESS"));
		}
	}

	componentDidMount() {
		this.getDatabaseData();
	}

	render() {
		const {
			emotions,
			emotionBtnEnable,
			emotionItemEnable,
			selectedEmotion,
		} = this.state;

		const {
			getTodayDate,
			onChangeContents,
			addDiary,
			selectEmotion,
		} = this;

		const styles = getStyleSheet();

		this.logoOpacityStyle = { opacity: this.logoOpacity };
		this.btnOpacityStyle = { opacity: Animated.add(1, Animated.multiply(-3, this.logoOpacity)) };

		return(
			<ImageBackground
			source={require('../../assets/drawable/bg_main.png')}
			style={{flex: 1}}>
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
					{/* 일기장 추가 버튼 */}
					{emotionBtnEnable ?
					<TouchableOpacity
					onPress={() => addDiary()}>
						<Text style={styles.main__topText}>그만 쓸래요</Text>
					</TouchableOpacity> : null}
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
				{emotionBtnEnable && !emotionItemEnable ?
				<Animated.View
				style={[this.btnOpacityStyle, {flexDirection: 'row'}]}>
					<TouchableOpacity
					onPress={() => {
						this.setState({ emotionItemEnable: true });
						Keyboard.dismiss();
					}}
					activeOpacity={.8}
					style={selectedEmotion.eid == -1 ?
					styles.main__emotionBtn : styles.main__emotionBtnSelected}>
						{selectedEmotion.eid == -1 ?
						<Text style={styles.main__emotionBtn__text}>+ 기분 태그달기</Text> :
						<Text style={styles.main__emotionBtn__textSelected}>{selectedEmotion.name}</Text>}
					</TouchableOpacity>
				</Animated.View>
				: null}

				{/* 기분 아이템 리스트 */}
				{emotionItemEnable ?
				<View>
					<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}>
					<View>
						<View style={{flexDirection: 'row'}}>
							{emotions.slice(0, Math.floor(emotions.length/3)).map(emo => 
							<TouchableOpacity
							onPress={() => selectEmotion(emo)}
							style={
								selectedEmotion.eid == emo.eid ?
								styles.main__emotionBtnSelected : styles.main__emotionBtn}
							activeOpacity={.8}>
								<Text
								style={
									selectedEmotion.eid == emo.eid ?
									styles.main__emotionBtn__textSelected : styles.main__emotionBtn__text
								}>{emo.name}</Text>
							</TouchableOpacity>
							)}
						</View>
						<View style={{flexDirection: 'row'}}>
							{emotions.slice(Math.floor(emotions.length/3), Math.floor(emotions.length*2/3)).map(emo => 
							<TouchableOpacity
							onPress={() => selectEmotion(emo)}
							style={
								selectedEmotion.eid == emo.eid ?
								styles.main__emotionBtnSelected : styles.main__emotionBtn}
							activeOpacity={.8}>
								<Text
								style={
									selectedEmotion.eid == emo.eid ?
									styles.main__emotionBtn__textSelected : styles.main__emotionBtn__text
								}>{emo.name}</Text>
							</TouchableOpacity>
							)}
						</View>
						<View style={{flexDirection: 'row'}}>
							{emotions.slice(Math.floor(emotions.length*2/3)).map(emo => 
							<TouchableOpacity
							onPress={() => selectEmotion(emo)}
							style={
								selectedEmotion.eid == emo.eid ?
								styles.main__emotionBtnSelected : styles.main__emotionBtn}
							activeOpacity={.8}>
								<Text
								style={
									selectedEmotion.eid == emo.eid ?
									styles.main__emotionBtn__textSelected : styles.main__emotionBtn__text
								}>{emo.name}</Text>
							</TouchableOpacity>
							)}
						</View>
					</View>
					</ScrollView>
					{/* 기분 태그 닫기 */}
					<TouchableOpacity
					onPress={() => this.setState({ emotionItemEnable: false })}
					activeOpacity={.8}>
						<Text style={styles.main__emotionBtn__text}>태그 닫기</Text>
					</TouchableOpacity>
				</View>
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

				<Image
				source={!emotionBtnEnable ? 
					require('../../assets/drawable/flower_sprout.gif') :
					selectedEmotion.eid == -1 ?
					require('../../assets/drawable/flower_bud.gif') :
					require('../../assets/drawable/flower_blooming.gif')}
				style={{position: 'absolute', bottom: 20, alignSelf: 'center'}}
				/>

			</TouchableOpacity>
			</SafeAreaView>
			</ImageBackground>
		)
	}
}