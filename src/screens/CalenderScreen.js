import React from 'react';
import {
	View,
	Animated,
	Image,
	ImageBackground,
} from 'react-native';
import getStyleSheet, { COLORS } from '../values/Styles';
import Calender from '../components/Calender';

const TAG = 'CalenderScreen/';

export default class CalenderScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			diaries: this.props.route.params.diaries,
			emotions: this.props.route.params.emotions,
		};

		this.todayDate = new Date();
		this.logoOpacity = new Animated.Value(1);		// 로고 불투명도
		this.screenTop = new Animated.Value(0);
	};

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
		const { diaries, emotions } = this.state;
		const styles = getStyleSheet();

		this.screenTopStyle = { top: this.screenTop.interpolate({
			inputRange: [0, 1],
			outputRange: ['0%', '-80%']
		}) };
		this.screenGreenStyle = { top: this.screenTop.interpolate({
			inputRange: [0, 1],
			outputRange: ['100%', '20%']
		}) };

		return(
			<View style={{flex: 1}}>
				<Animated.View
				style={[{flex: 1}, this.screenTopStyle]}>
					<ImageBackground
					source={require('../../assets/drawable/bg_main.png')}
					style={{flex: 1}} />
					<Image
					source={require('../../assets/drawable/flower_blooming.gif')}
					style={{position: 'absolute', bottom: 20, alignSelf: 'center'}}
					/>
				</Animated.View>
				<Animated.View
				style={[this.screenGreenStyle, styles.bg__green]}>
					<Calender todayDate={this.todayDate} diaries={diaries} emotions={emotions} />
				</Animated.View>
			</View>
		)
	}
}