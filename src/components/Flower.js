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

		const { id, changeFlowerPos } = this.props;

		this.flowerPos = new Animated.ValueXY();
		this.boxPos = new Animated.ValueXY();
		this.boxOpacity = new Animated.Value(0);

    this.flowerResponder = PanResponder.create({

			// 주어진 터치이벤트에 반응할지 결정
      onStartShouldSetPanResponder: (event, gesture) => true,

      // 터치이벤트 발생할 때
      onPanResponderGrant: (event, gesture) => {
				Animated.timing(
					this.boxOpacity,
					{
						toValue: 1,
						duration: 100,
						useNativeDriver: true,
					}
				).start();
			},
			
      // MOVE 제스쳐가 진행 중일 때 (계속 실행)
			onPanResponderMove: Animated.event(
				[null, { dx: this.flowerPos.x, dy: this.flowerPos.y }],
				{
					useNativeDriver: false,
					listener: () => {
						const movedBlankX = Math.round(this.flowerPos.x._value/50);	// 꽃의 이동 칸 수
						const movedBlankY = Math.round(this.flowerPos.y._value/50);
						// 꽃의 이동 칸 수가 바뀔 때만 빨간 박스를 옮긴다
						if(this.boxPos.x._value/50 != movedBlankX || this.boxPos.y._value/50 != movedBlankY)
						this.boxPos.setValue({ x: movedBlankX * 50, y: movedBlankY * 50 });
					},
				}),

      // 터치이벤트 끝날 때
      onPanResponderRelease: (event, gesture) => {
				Animated.timing(
					this.boxOpacity,
					{
						toValue: 0,
						duration: 1,
						useNativeDriver: true,
					}
				).start();

				const newBlankX = this.props.flowerBlank.x + Math.round(gesture.dx / 50);
				const newBlankY = this.props.flowerBlank.y + Math.round(gesture.dy / 50);
				this.flowerPos.setValue({ x: 0, y: 0 });
				this.boxPos.setValue({ x: 0, y: 0 });

				changeFlowerPos(id, newBlankX, newBlankY);
				// this.forceUpdate();
      }
		});
	}

	render() {
		const { id, require, flowerBlank } = this.props;
		const styles = getStyleSheet();

		this.containerPosStyle = {
			left: 50 * flowerBlank.x,
			top: 50 * flowerBlank.y,
			zIndex: Animated.add(flowerBlank.y, Animated.divide(this.boxPos.y, 50)),
		}
		this.boxPosStyle = {
			left: this.boxPos.x,
			top: this.boxPos.y,
		};
		this.boxOpacityStyle = {
			opacity: this.boxOpacity,
		};
		this.flowerPosStyle = {
			left: this.flowerPos.x,
			top: this.flowerPos.y
		};


		return (
			<Animated.View style={[this.containerPosStyle, {position: 'absolute'}]}>
				{/* 이동할 곳 마킹하는 박스 */}
				<Animated.View style={[this.boxPosStyle, {position: 'absolute'}]}>
					<Animated.View style={[this.boxOpacityStyle, {width: 50, height: 50, borderWidth: 2, borderColor: 'red'}]} />
				</Animated.View>
				
				{/* Flower 이미지 */}
				<Animated.View
				{...this.flowerResponder.panHandlers}
				style={[this.flowerPosStyle, {width: 50, height: 50}]}>
					<Image
					pointerEvents='none'
					source={require}
					style={{position: 'absolute', bottom: 0, width: 50, height: 100}}
					/>
				</Animated.View>
			</Animated.View>
    )
  }
}