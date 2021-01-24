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

const flowersRequire = {
	'나팔꽃': require('../../assets/drawable/flower_morningGlory.png'),
	'국화-노랑': require('../../assets/drawable/flower_chrysanthemum-yellow.png'),
	'국화-하양': require('../../assets/drawable/flower_chrysanthemum-white.png'),
	'양귀비': require('../../assets/drawable/flower_poppy.png'),
};

export default class CalenderScreen extends React.Component {
	constructor(props) {
		super(props);

		const { diaries, emotions, flowers, todayDiary } = this.props.route.params;
		this.state = {
			diaries: diaries,
			emotions: emotions,
			flowers: flowers,
			todayDiary: todayDiary,
		};

		this.todayDate = new Date();
		this.logoOpacity = new Animated.Value(1);		// 로고 불투명도
		this.screenTop = new Animated.Value(0);
		this.flowerName = this.findFlowerName(todayDiary.fid);

		console.log(this.flowerName);

		console.log(encodeURI('/drawable/_국화.png'));
	};

	findFlowerName = (fid) => {
		const { flowers } = this.state;

		for(let i=0; i < flowers.length; i++) {
			if(flowers[i].fid == fid)
			return flowers[i].name;
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
		const { diaries, emotions, flowers } = this.state;
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
					source={flowersRequire[this.flowerName]}
					style={{position: 'absolute', bottom: 20, alignSelf: 'center'}}
					/>
				</Animated.View>
				<Animated.View
				style={[this.screenGreenStyle, styles.bg__green]}>
					<Calender todayDate={this.todayDate} diaries={diaries} emotions={emotions} flowers={flowers} />
				</Animated.View>
			</View>
		)
	}
}