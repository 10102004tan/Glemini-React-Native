import {Modal, ScrollView, View, StyleSheet, Animated} from "react-native";
import {useState} from "react";
import {GestureHandlerRootView, PanGestureHandler, State} from "react-native-gesture-handler";

export default function FragmentDialog({children}) {
    const [visible, setVisible] = useState(true);
    const translateY = new Animated.Value(0);

    const onGuestureEvent = Animated.event(
        [{nativeEvent: {translationY: translateY}}],
        {useNativeDriver: true}
    );

    const onHandlerStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            let opened = false;
            const {translationY} = event.nativeEvent;
            if (translationY < -100) {
                opened = true;
            } else {
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true
                }).start();
            }
            setVisible(opened);
        }
    };

    return (
        <Modal visible={true} >
            <GestureHandlerRootView style={{flex:1}}>
                <View style={styles.container}></View>
            </GestureHandlerRootView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop:10
    }
});