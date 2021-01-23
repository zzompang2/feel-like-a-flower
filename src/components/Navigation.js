import React from "react";
import { 
	SafeAreaView,
	TouchableOpacity,
	Text,
	View,
} from "react-native";
import getStyleSheet from "../values/Styles";

const TAG = "Navigation/";

export default class Navigation extends React.Component {
	
	render() {
		const { navigation, state } = this.props;
		const styles = getStyleSheet();

		return (
			<SafeAreaView
			style={styles.navigation}>
				<TouchableOpacity
				activeOpacity={.7}
				style={styles.navigation__btnBox}
				onPress={() => navigation.navigate('Diary')}>
					<View style={styles.navigation__shadow__light} />
					<View style={styles.navigation__shadow__dark} />
					<View style={styles.navigation__btn}>
						<Text style={styles.navigation__btnText}>일기장</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
				activeOpacity={.7}
				style={styles.navigation__btnBox}
				onPress={() => navigation.navigate('Main')}>
					<View style={styles.navigation__shadow__light} />
					<View style={styles.navigation__shadow__dark} />
					<View style={styles.navigation__btn}>
						<Text style={styles.navigation__btnText}>캘린더</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
				activeOpacity={.7}
				style={styles.navigation__btnBox}
				onPress={() => navigation.navigate('Garden')}>
					<View style={styles.navigation__shadow__light} />
					<View style={styles.navigation__shadow__dark} />
					<View style={styles.navigation__btn}>
						<Text style={styles.navigation__btnText}>정원</Text>
					</View>
				</TouchableOpacity>
			</SafeAreaView>
    )
  }
}