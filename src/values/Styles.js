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
	}
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