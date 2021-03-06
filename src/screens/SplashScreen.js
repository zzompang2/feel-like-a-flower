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

const TAG = 'SplashScreen/';
const db = SQLite.openDatabase({ name: 'FeelLikeAFlower.db' });
const flowersRequire = {
	'나팔꽃': require('../../assets/drawable/flower_morningGlory.png'),
	'국화-노랑': require('../../assets/drawable/flower_chrysanthemum-yellow.png'),
	'국화-하양': require('../../assets/drawable/flower_chrysanthemum-white.png'),
	'양귀비': require('../../assets/drawable/flower_poppy.png'),
};

export default class SplashScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			diaries: [],
			emotions: [],
			flowers: [],
			emotionBtnEnable: false,									// 기분 추가하기 버튼을 보이게 할 것인가
			emotionItemEnable: false,
			selectedEmotion: {eid: 0},
		};

		this.todayDate = new Date();
		this.dateString = this.getTodayDate(this.todayDate);
		this.diaryId = this.getTodayDiaryId(this.todayDate);
		this.contents == '';
		this.logoOpacity = new Animated.Value(1);		// 로고 불투명도
		this.logoDisappear = false;									// 로고 안 보이는지 여부
		this.keyboradState = false;
	};

	getDatabaseData() {
		const diaries = [];
		const emotions = [];
		const flowers = [];

		db.transaction(txn => {
			/*=== 기존 TABLE 초기화(for debug) ===*/
			// txn.executeSql('DROP TABLE IF EXISTS diaries');
			// txn.executeSql('DROP TABLE IF EXISTS emotions');
			// txn.executeSql('DROP TABLE IF EXISTS flowers');

			/*=== TABLE 생성 ===*/
			txn.executeSql(
				'CREATE TABLE IF NOT EXISTS diaries(' +
				'id INTEGER NOT NULL, ' +
				'date TEXT NOT NULL, ' +
				'editDate TEXT NOT NULL, ' +
				'eid INTEGER NOT NULL, ' +
				'contents TEXT NOT NULL, ' +
				'fid INTEGER NOT NULL, ' +
				'x INTEGER NOT NULL, ' +
				'y INTEGER NOT NULL, ' +
				'PRIMARY KEY(id))'
			);

			txn.executeSql(
				'CREATE TABLE IF NOT EXISTS emotions(' +
				'eid INTEGER NOT NULL, ' +
				'name TEXT NOT NULL, ' +
				'type INTEGER NOT NULL, ' +
				'PRIMARY KEY(eid))'
			);

			txn.executeSql(
				'CREATE TABLE IF NOT EXISTS flowers(' +
				'fid INTEGER NOT NULL, ' +
				'name TEXT NOT NULL, ' +
				'language TEXT NOT NULL, ' +
				'eidList TEXT NOT NULL, ' +
				'PRIMARY KEY(fid))'
			);

			// txn.executeSql("INSERT INTO flowers VALUES (?, ?, ?, ?)", [0, '나팔꽃', '꽃말0', '-1-2-3-']);
			// txn.executeSql("INSERT INTO flowers VALUES (?, ?, ?, ?)", [1, '국화-하양', '꽃말1', '-1-4-5-6-7-']);
			// txn.executeSql("INSERT INTO flowers VALUES (?, ?, ?, ?)", [2, '국화-노랑', '꽃말2', '-1-2-8-']);
			// txn.executeSql("INSERT INTO flowers VALUES (?, ?, ?, ?)", [3, '양귀비', '꽃말3', '-3-7-8-9-']);

			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
			// 	20210101, '2021.01.01', '2021.01.01', 3, 
			// 	'난 너를 믿었던 만큼 난 내 친구도 믿었기에 난 아무런 부담없이 널 내 친구들에게 소개시켜줬고 그런 만남이 있는 후로부터 우리는 서로 함께 만나며 즐거운 시간을 보내며 함께 어울렸던 것 뿐인데..',
			// 	0, 0, 0]);
			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [20210104, '2021.01.04', '2021.01.04', 5, '기분이 애매한데..', 1, 1, 1]);
			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [20210106, '2021.01.06', '2021.01.06', 6, '오늘 친구랑 싸움', 1, 2, 2]);
			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [20210107, '2021.01.07', '2021.01.07', 1, '오랜만에 옷 쇼핑! 언제 올까나', 3, 3, 3]);
			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [20210108, '2021.01.08', '2021.01.08', 1, '오랜만에 옷 쇼핑! 언제 올까나', 3, 3, 3]);
			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [20210109, '2021.01.09', '2021.01.09', 5, '음.....ㅠㅠ', 2, 4, 4]);
			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [20210110, '2021.01.10', '2021.01.10', 1, '예이예', 3, 0, 3]);
			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [20210113, '2021.01.13', '2021.01.13', 1, '일기 내용을 적어주세요', 0, 3, 4]);
			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [20210115, '2021.01.15', '2021.01.15', 1, '일기 내용을 적어주세요', 0, 3, 5]);
			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [20210117, '2021.01.17', '2021.01.17', 1, '일기 내용을 적어주세요', 1, 3, 6]);
			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [20210118, '2021.01.18', '2021.01.18', 1, '일기 내용을 적어주세요', 1, 4, 3]);
			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [20210119, '2021.01.19', '2021.01.19', 1, '일기 내용을 적어주세요', 2, 4, 5]);
			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [20210120, '2021.01.20', '2021.01.20', 1, '일기 내용을 적어주세요', 2, 4, 6]);
			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [20210122, '2021.01.22', '2021.01.22', 1, '일기 내용을 적어주세요', 3, 5, 3]);
			// txn.executeSql("INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [20210123, '2021.01.23', '2021.01.23', 1, '일기 내용을 적어주세요', 3, 5, 0]);

			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [0, '없음', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [1, '기대', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [2, '기쁨', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [3, '절망', 1]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [4, '슬픔', 1]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [5, '애매모호', 2]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [6, '인내', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [7, '아름다움', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [8, '승리', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [9, '절망', 1]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [10, '슬픔', 1]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [11, '애매모호', 2]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [12, '인내', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [13, '아름다움', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [14, '승리', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [20, '행복', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [21, '기대', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [22, '기쁨', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [23, '절망', 1]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [24, '슬픔', 1]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [25, '애매모호', 2]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [26, '인내', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [27, '아름다움', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [28, '승리', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [29, '절망', 1]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [210, '슬픔', 1]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [211, '애매모호', 2]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [212, '인내', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [213, '아름다움', 0]);
			// txn.executeSql("INSERT INTO emotions VALUES (?, ?, ?)", [124, '승리', 0]);

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

							txn.executeSql(
								"SELECT * FROM flowers",
								[],
								(txn, result) => {
									// note 정보 가져오기
									for (let i = 0; i < result.rows.length; i++)
									flowers.push(result.rows.item(i));

									txn.executeSql(
										"SELECT * FROM diaries WHERE id=?",
										[this.diaryId],
										(txn, result) => {
											// nested navigation 에게 데이터 보내는 방법
											if(result.rows.length)
											this.props.navigation.navigate('Main', {
												screen: 'Calender',
												params: {
													diaries: diaries,
													emotions: emotions,
													flowers: flowers,
													todayDiary: result.rows.item(0),
													flowersRequire: flowersRequire,
												}
											});
											else
											this.setState({ diaries, emotions, flowers });
										}
									);
								}
							);
						}
					);
				}
			);
		},
		e => console.log("DB ERROR", e),
		() => console.log("DB SUCCESS"));
	}

	/* Date() 로 받은 날짜 값을 YYYY.MM.DD 포멧의 string 으로 변경 */
	getTodayDate(date) {
		return `${date.getFullYear()}.` +
					 `${(date.getMonth() < 9 ? '0' : '') + (date.getMonth()+1)}.` +
					 `${(date.getDate() < 10 ? '0' : '') + date.getDate()}`;
	}

	/* Date() 로 받은 날짜 값으로 YYYYMMDD 숫자를 만든다 */
	getTodayDiaryId(date) {
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
		this.setState({ selectedEmotion: {eid: 0} });
		else
		this.setState({ selectedEmotion: emotion });
	}

	addDiary = () => {
		const { selectedEmotion: { eid }, diaries, emotions, flowers } = this.state;

		Keyboard.dismiss();
		if(this.contents == '')
		Alert.alert("일기장 내용", "오늘 기분이 어떠신가요? ^__^",
		[{ text: '적어볼게요' }]);

		else {
			const id = this.diaryId;
			const date = this.dateString;
			let fid = -1;
			const fidList = [];

			// eid 를 포함하는 flower 를 모두 찾는다
			if(eid > 0) {
				for(let i=0; i<flowers.length; i++) {
					if(flowers[i].eidList.indexOf('-' + eid + '-') >= 0)
					fidList.push(flowers[i].fid);
				}
			}

			// 랜덤으로 한 꽃을 선정한다
			if(fidList.length > 0)
			fid = fidList[Math.floor(Math.random() * fidList.length)];
			
			console.log('선택한 eid:', eid, 'fidList', fidList, '중에서 선택된 fid =', fid);
			
			const newDiary = { id, date, editDate: date, eid, contents: this.contents, fid, x: 6, y: 6 };

			db.transaction(txn => {
				txn.executeSql(
					"INSERT INTO diaries VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
					[id, date, date, eid, this.contents, fid, 6, 6],
					() => this.props.navigation.navigate('Main', {
						screen: 'Calender',
						params: {
							diaries: [...diaries, newDiary],
							emotions: emotions,
							flowers: flowers,
							todayDiary: newDiary,
							flowersRequire: flowersRequire,
						}
					})
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
			onChangeContents,
			addDiary,
			selectEmotion,
		} = this;

		const styles = getStyleSheet();

		this.logoOpacityStyle = { opacity: this.logoOpacity };
		this.btnOpacityStyle = { opacity: Animated.add(1, Animated.multiply(-3, this.logoOpacity)) };

		return(
			<View style={styles.bg}>
				<ImageBackground
				source={require('../../assets/drawable/bg_main.png')}
				style={{flex: 1}}>
				<SafeAreaView style={styles.bg}>
				<TouchableOpacity
				style={[styles.bg, {padding: 20}]}
				onPress={() => {
					if(!this.keyboradState && !emotionBtnEnable) {
						this.contentsInput.focus();
						this.keyboradState = true;
					}
					else {
						Keyboard.dismiss();
						this.keyboradState = false;
					}
				}}
				activeOpacity={1}>

					{/* 상단 바 */}
					<View style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						paddingBottom: 5}}>
						<Text style={styles.main__topText}>{this.dateString}</Text>

						<View style={styles.main__topLine} />

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
						style={selectedEmotion.eid == 0 ?
						styles.main__emotionBtn : styles.main__emotionBtnSelected}>
							{selectedEmotion.eid == 0 ?
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
								key={emo.eid}
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
								key={emo.eid}
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
								key={emo.eid}
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
							alignSelf: 'center',
							alignItems: 'center',
							justifyContent: 'center',
						},
						this.logoOpacityStyle
					]}>
						<Image
						source={require('../../assets/drawable/logo.png')}
						style={[styles.logo, {width: 300, height: 60}]}
						/>
					</Animated.View>

					{!emotionBtnEnable ? null :
					<Image
					source={
						selectedEmotion.eid == 0 ?
						require('../../assets/drawable/flower_seed.png') :
						require('../../assets/drawable/flower_sprout.gif')}
					style={{position: 'absolute', bottom: 20, alignSelf: 'center'}}
					/>
					}
				</TouchableOpacity>
				</SafeAreaView>
				</ImageBackground>
				<View style={styles.navigation} />
			</View>
		)
	}
}