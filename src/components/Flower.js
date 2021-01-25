import React from "react";
import { 
	TouchableOpacity,
	View,
	Image,
	Animated,
	PanResponder,
} from "react-native";
import getStyleSheet from "../values/Styles";

const TAG = "Flower/";


export default class Flower extends React.Component {
	constructor(props) {
		super(props);

		this.curPos = { x: 0, y: 0 };

		this.movedPos = new Animated.ValueXY();
		this.boxPos = new Animated.ValueXY();

		/*===== Left 버튼 =====*/
    this.flowerResponder = PanResponder.create({

			// 주어진 터치이벤트에 반응할지 결정
      onStartShouldSetPanResponder: (event, gesture) => true,

      // 터치이벤트 발생할 때
      onPanResponderGrant: (event, gesture) => {},
			
      // MOVE 제스쳐가 진행 중일 때 (계속 실행)
			onPanResponderMove: Animated.event(
				[null, { dx: this.movedPos.x, dy: this.movedPos.y }],
				{
					useNativeDriver: false,
					listener: () => {
						const dxBlank = Math.round(this.movedPos.x._value/50);	// 꽃의 이동 칸 수
						const dyBlank = Math.round(this.movedPos.y._value/50);
						if(this.boxPos.x._value/50 != dxBlank || this.boxPos.y._value/50 != dyBlank)
						this.boxPos.setValue({ x: dxBlank * 50, y: dyBlank * 50 });
					},
				}),

      // 터치이벤트 끝날 때
      onPanResponderRelease: (event, gesture) => {
				const x = this.curPos.x + Math.round(gesture.dx / 50);
				const y = this.curPos.y + Math.round(gesture.dy / 50);
				this.movedPos.setValue({ x: 0, y: 0 });
				this.boxPos.setValue({ x: 0, y: 0 });

				this.curPos = { x, y };
				this.forceUpdate();
      }
		});
	}

	render() {
		const { require } = this.props;
		const styles = getStyleSheet();

		this.flowerPosStyle = { left: Animated.add(this.curPos.x * 50, this.movedPos.x), top: Animated.add(this.curPos.y * 50, this.movedPos.y) };
		this.boxPosStyle = { left: Animated.add(this.curPos.x * 50, this.boxPos.x), top: Animated.add(this.curPos.y * 50, this.boxPos.y) };

		console.log(Animated.event);

		return (
			<View style={{position: 'absolute'}}>
				<Animated.View style={[this.boxPosStyle, {position: 'absolute', width: 50, height: 50, borderWidth: 2, borderColor: 'red'}]} />
				<Animated.View
				{...this.flowerResponder.panHandlers}
				style={[this.flowerPosStyle]}>
					<Image
					source={require}
					style={{width: 50, height: 50}}
					/>
				</Animated.View>
			</View>
    )
  }
}