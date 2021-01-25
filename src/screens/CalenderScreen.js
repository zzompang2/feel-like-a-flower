import React from 'react';
import {
	View,
	Animated,
	Image,
	ImageBackground,
	Text,
	TouchableOpacity,
} from 'react-native';
import getStyleSheet from '../values/Styles';

const TAG = 'CalenderScreen/';
const days = ["일", "월", "화", "수", "목", "금", "토"];

export default class CalenderScreen extends React.Component {
	constructor(props) {
		super(props);

		const { diaries, emotions, flowers, todayDiary, flowersRequire } = this.props.route.params;

		this.state = {
			diaries: diaries,
			emotions: emotions,
			flowers: flowers,
			todayDiary: todayDiary,
			flowersRequire: flowersRequire,
			viewMode: 'flower',		// ['emotion', 'flower']
		};

		this.screenTop = new Animated.Value(0);									// splash 에서 넘어올 때 스크린 올라가는 애니메이션을 위해.
		this.flowerName = this.findFlowerName(todayDiary.fid);	// 오늘의 꽃 이름
		
		const todayDate = new Date();														// 오늘 날짜정보
		this.year = todayDate.getFullYear();
		this.month = todayDate.getMonth() + 1;
		this.date = todayDate.getDate();
		this.lastDayOfMonth = this.getLastDayOfMonth(this.month);	// 이번 달의 마지막 날 (28, 29, 30, 31)

		this.dateInformation = [];		// 각 날짜에 대한 정보들
		let diariesIdx = 0;						// 확인 안 한 diary 중 가장 빠른 날짜의 diary index

		// 첫 주
		const firstWeek = [];
		// '1일' 앞 공백 만큼 0 넣기
		const spaceNumAtFrontOfCalender = this.getSpaceNumAtFrontOfCalender(this.date, todayDate.getDay());
		for(let i=0; i<spaceNumAtFrontOfCalender; i++)
		firstWeek.push({ date: 0 });
		// 1일 부터 넣기
		let date = 1;
		while(firstWeek.length != 7) {
			if(diaries[diariesIdx]?.id % 100 == date) {
				firstWeek.push({ date, diariesIdx });
				diariesIdx++;
			}
			else
			firstWeek.push({ date, diariesIdx: -1 });
			date++;
		}
		this.dateInformation.push(firstWeek);

		// 둘 쩃주 ~ 마지막 주
		while(date <= this.lastDayOfMonth) {
			const week = [];
			while(week.length != 7) {
				if(date <= this.lastDayOfMonth) {
					if(diaries[diariesIdx]?.id % 100 == date) {
						week.push({ date, diariesIdx });
						diariesIdx++;
					}
					else
					week.push({ date, diariesIdx: -1 });
				}
				else
				week.push({ date: 0 });
				date++;
			}
			this.dateInformation.push(week);
		}
	};

	/**
	 * 오늘의 date, day 를 주면 해당 월 달력 맨 앞의 공백 개수를 계산한다.
	 * @param {number} date 일
	 * @param {number} day 해당 일의 요일
	 */
	getSpaceNumAtFrontOfCalender(date, day) {
		const firstSundayDate = (date - day) % 7;
		return firstSundayDate == 1 ? 0 : 8-firstSundayDate;
	}
	/**
	 * 해당 달의 마지막 날. (28, 29, 30, 31)
	 * @param {number} month 
	 */
	getLastDayOfMonth(month) {
		switch(month) {
			case 1:
			case 3:
			case 5:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				return 31;
			case 4:
			case 6:
			case 9:
			case 11:
				return 30;
			case 2:
				if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0)
				return 29;
				else
				return 28;
			default:
				return -1;
		}
	}

	findFlowerName = (fid) => {
		const { flowers } = this.state;

		for(let i=0; i < flowers.length; i++) {
			if(flowers[i].fid == fid)
			return flowers[i].name;
		}
		return "?";
	}

	changeViewMode = () => {
		const { viewMode } = this.state;
		if(viewMode == 'flower')
		this.setState({ viewMode: 'emotion' });
		else
		this.setState({ viewMode: 'flower' });
	}

	findEmotionName = (eid) => {
		const { emotions } = this.state;

		for(let i=0; i < emotions.length; i++) {
			if(emotions[i].eid == eid)
			return emotions[i].name;
		}
		return "?";
	}

	componentDidMount() {
		Animated.timing(
			this.screenTop,
			{
				toValue: 1,
				duration : 800,
				delay: 200,
				useNativeDriver: false,
			}
		).start();
	}

	render() {
		const { diaries, emotions, flowers, viewMode, flowersRequire } = this.state;
		const styles = getStyleSheet();
		const {
			changeViewMode,
			findEmotionName,
			findFlowerName,
		} = this;

		this.screenTopStyle = { top: this.screenTop.interpolate({
			inputRange: [0, 1],
			outputRange: ['0%', '-70%']
		}) };
		this.screenGreenStyle = { top: this.screenTop.interpolate({
			inputRange: [0, 1],
			outputRange: ['100%', '30%']
		}) };

		return(
			<View style={{flex: 1}}>
				<Animated.View
				style={[{flex: 1}, this.screenTopStyle]}>
					<ImageBackground
					source={require('../../assets/drawable/bg_main.png')}
					style={{flex: 1}} />
					<Image
					source={flowersRequire[this.flowerName]}
					style={{position: 'absolute', bottom: 20, alignSelf: 'center'}}
					/>
				</Animated.View>
				<Animated.View
				style={[this.screenGreenStyle, styles.bg__green]}>

				<View style={[styles.bg, {alignItems: 'center'}]}>
					<View style={styles.calender}>
						{/* Year, Month */}
						<View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
							<View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
								<Text style={styles.calender__year}>{this.year}</Text>
								<Text style={styles.calender__month}>{(this.month < 10 ? '0' : '') + this.month}</Text>
							</View>
							<TouchableOpacity
							onPress={changeViewMode}
							activeOpacity={.8}>
								<Text style={styles.main__topText}>{viewMode == 'flower' ? '기분으로 보기' : '꽃으로 보기'}</Text>
							</TouchableOpacity>
						</View>
						{/* Date */}
						<View style={styles.calender__date__container}>
							<View style={styles.calender__date__shadow__light} />
							<View style={styles.calender__date__shadow__dark} />
							<View style={styles.calender__date}>
								<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
									{days.map(day =>
										<View key={day} style={styles.calender__dayBox}>
											<Text style={styles.calender__dayText}>{day}</Text>
										</View>
									)}
								</View>
								{this.dateInformation.map((week, idx) =>
								<View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
									{week.map((item, idx) =>
									<View
									key={idx}
									style={item.date == 0 ?
										styles.calender__dateBox__empty :
										item.date < this.date && item.diariesIdx < 0 ?
										styles.calender__dateBox__past :
										item.date == this.date ?
										styles.calender__dateBox__today :
										styles.calender__dateBox__coming
									}>
										{item.diariesIdx >= 0 ?
										viewMode == 'emotion' ?
										<Text style={styles.calender__emotionName}>{findEmotionName(diaries[item.diariesIdx].eid)}</Text>
										:
										<View style={{width: 40, height: 40, alignItems: 'center'}}>
											<Image
											source={flowersRequire[findFlowerName(diaries[item.diariesIdx].fid)]}
											style={{position: 'absolute', top: 0, width: 20, height: 40}}
											/>
										</View>
										:
										<Text style={styles.calender__dateText}>{item.date}</Text>
										}
									</View>
									)}
								</View>
								)}
							</View>
						</View>
					</View>
				</View>
					
				</Animated.View>
			</View>
		)
	}
}