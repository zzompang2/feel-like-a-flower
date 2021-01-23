import { StyleSheet, Dimensions } from 'react-native';

// 화면의 가로, 세로 길이 받아오기
const { width, height } = Dimensions.get('window');

export const COLORS = {
	white: '#ffffff',
	gray: '#dddddd',
	black: '#000000',
	green1: '#d1ef9e',
	green2: '#bce07e',
	green3: '#6cbe87',
	green4: '#3b5d59',
	pink: '#ff9f86',
}

const basicStyleSheet = StyleSheet.create({
	bg: {
		flex: 1,
	},
	logo: {
		fontSize: 30,
	},
	contentsInput: {
		width: '100%',
		fontSize: 25,
		paddingVertical: 15,
	},
	main__topText: {
		fontSize: 15,
	},
	main__topLine: {
		flex: 1,
		height: 1,
		marginHorizontal: 10,
	},
	main__emotionBtn: {
		height: 26,
		borderRadius: 13,
		borderWidth: 1,
		marginRight: 5,
		marginBottom: 5,
		justifyContent: 'center',
		alignSelf: 'center'
	},
	main__emotionBtn__text: {
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	calender: {
		flexDirection: 'column',
		justifyContent: 'center',
		width: '90%'
	},
	calender__year: {
		fontSize: 25,
	},
	calender__month: {
		fontSize: 40,
		fontWeight: 'bold',
	},
	calender__dayBox: {
		width: 40,
		height: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	calender__dayText: {
		fontSize: 12,
	},
	calender__date__container: {
		width: width * 0.9,
		height: width * 0.9,
		marginTop: 20,
	},
	calender__date: {
		width: '100%',
		height: '100%',
		padding: 25,
		borderRadius: 40,
		justifyContent: 'space-around',
	},
	calender__date__shadow__light: {
		position: 'absolute',
		backgroundColor: COLORS.white,
		shadowColor: COLORS.white,
		shadowOffset: { width: -5, height: -5, },
		shadowOpacity: 0.8,
		shadowRadius: 5,
	},
	calender__date__shadow__dark: {
		position: 'absolute', 
		backgroundColor: COLORS.green3,
		shadowColor: COLORS.green3,
		shadowOffset: { width: 5, height: 5, },
		shadowOpacity: 0.6,
		shadowRadius: 15,
	},
	calender__dateBox: {
		width: 40,
		height: 40,
		borderWidth: 2,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		margin: 1,
	},
	calender__dateText: {
		fontSize: 25,
	},
});

const lightStyleSheet = StyleSheet.create({
	bg: {
		...basicStyleSheet.bg,
	},
	logo: {
		...basicStyleSheet.logo,
		color: COLORS.black,
	},
	contentsInput: {
		...basicStyleSheet.contentsInput,
	},
	main__topText: {
		...basicStyleSheet.main__topText,
		color: COLORS.green3,
	},
	main__topLine: {
		...basicStyleSheet.main__topLine,
		backgroundColor: COLORS.green3,
	},
	main__emotionBtn: {
		...basicStyleSheet.main__emotionBtn,
		borderColor: COLORS.green3,
	},
	main__emotionBtnSelected: {
		...basicStyleSheet.main__emotionBtn,
		borderColor: COLORS.green3,
		backgroundColor: COLORS.green3,
	},
	main__emotionBtn__text: {
		...basicStyleSheet.main__emotionBtn__text,
		color: COLORS.green3,
	},
	main__emotionBtn__textSelected: {
		...basicStyleSheet.main__emotionBtn__text,
		color: COLORS.white,
	},
	calender__date__container: {
		...basicStyleSheet.calender__date__container,
	},
	calender: {
		...basicStyleSheet.calender,
	},
	calender__year: {
		...basicStyleSheet.calender__year,
		color: COLORS.green3,
	},
	calender__month: {
		...basicStyleSheet.calender__month,
		color: COLORS.green3,
	},
	calender__dayBox: {
		...basicStyleSheet.calender__dayBox,
	},
	calender__dayText: {
		...basicStyleSheet.calender__dayText,
		color: COLORS.green3,
	},
	calender__date: {
		...basicStyleSheet.calender__date,
		backgroundColor: COLORS.green1,
	},
	calender__date__shadow__light: {
		...basicStyleSheet.calender__date,
		...basicStyleSheet.calender__date__shadow__light,
	},
	calender__date__shadow__dark: {
		...basicStyleSheet.calender__date,
		...basicStyleSheet.calender__date__shadow__dark,
	},
	calender__dateBox__empty: {
		...basicStyleSheet.calender__dateBox,
		borderColor: COLORS.green2,
	},
	calender__dateBox__past: {
		...basicStyleSheet.calender__dateBox,
		borderColor: COLORS.green2,
		backgroundColor: COLORS.green2,
	},
	calender__dateBox__today: {
		...basicStyleSheet.calender__dateBox,
		borderColor: COLORS.pink,
		backgroundColor: COLORS.white,
	},
	calender__dateBox__coming: {
		...basicStyleSheet.calender__dateBox,
		borderColor: COLORS.white,
		backgroundColor: COLORS.white,
	},
	calender__dateText: {
		...basicStyleSheet.calender__dateText,
		color: COLORS.green1,
	}
});

export default function getStyleSheet(theme) {
	switch(theme) {
		case 'light':
			return lightStyleSheet;
		case 'basic':
			return basicStyleSheet;
		default:
			return lightStyleSheet;
	}
}