import React from "react";
import { 
	Text,
	View,
	TouchableOpacity,
} from "react-native";
import getStyleSheet from "../values/Styles";

const TAG = "Calender/";
const days = ["일", "월", "화", "수", "목", "금", "토"];

export default class Calender extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			viewMode: 'flower',	// emotion
		};

		const { todayDate, diaries } = this.props;

		this.year = todayDate.getFullYear();
		this.month = todayDate.getMonth() + 1;
		this.date = todayDate.getDate();
		this.lastDayOfMonth = this.getLastDayOfMonth(this.month);

		this.dateComponents = [];
		let diariesIdx = 0;

		// 첫 주
		const firstWeek = [];
		const spaceNumAtFrontOfCalender = this.getSpaceNumAtFrontOfCalender(this.date, todayDate.getDay());
		for(let i=0; i<spaceNumAtFrontOfCalender; i++)
		firstWeek.push({ date: 0 });
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
		this.dateComponents.push(firstWeek);

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
			this.dateComponents.push(week);
		}
	}

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

	changeViewMode = () => {
		const { viewMode } = this.state;
		if(viewMode == 'flower')
		this.setState({ viewMode: 'emotion' });
		else
		this.setState({ viewMode: 'flower' });
	}

	findEmotionName = (eid) => {
		const { emotions } = this.props;
		console.log(eid);
		for(let i=0; i < emotions.length; i++) {
			if(emotions[i].eid == eid) {
				console.log(emotions[i]);
			return emotions[i].name;
			}
		}
		return {};
	}

	render() {
		const { todayDate, diaries } =this.props;
		const { viewMode } = this.state;
		const { changeViewMode, findEmotionName } = this;
		const styles = getStyleSheet();

		console.log(this.dateComponents);
		return (
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
							{this.dateComponents.map((week, idx) =>
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
									<Text style={styles.calender__emotionName}>{findEmotionName(diaries[item.diariesIdx].emotion)}</Text>
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
    )
  }
}