import React from "react";
import { 
	PanResponder, Animated, Text, View
} from "react-native";
import getStyleSheet from "../values/Styles";

const TAG = "Calender/";

export default class Calender extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const styles = getStyleSheet();

		return (
      <View>
				<Text>calender</Text>
			</View>
    )
  }
}