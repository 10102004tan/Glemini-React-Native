import {
    Modal,
    View,
    Text,
    TextInput,
    Animated,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    Platform,
} from 'react-native';
import { useEffect, useRef } from 'react';
import ScaleTouchable from '@/components/customs/ScaleTouchable';

const AnimatedModal = ({ visible, onClose, onSave, className, setClassName, selectedSchool, setSelectedSchool, selectedSubject, setSelectedSubject, schools, subjects, i18n }) => {
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();
        } else {
            slideAnim.setValue(0);
        }
    }, [visible]);

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
                        <Text style={styles.modalTitle}>{i18n.t('classroom.teacher.titleBts')}</Text>

                        {/* Select School */}
                        <Text style={styles.label}>{i18n.t('classroom.teacher.fieldSchool')}</Text>
                        <View style={styles.selectBox}>
                            {schools.map((s) => (
                                <ScaleTouchable key={s._id} onPress={() => setSelectedSchool(s._id)}>
                                    <View
                                        style={[
                                            styles.optionItem,
                                            selectedSchool === s._id && styles.selectedItem,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                selectedSchool === s._id && styles.selectedText,
                                            ]}
                                        >
                                            {s.school_name}
                                        </Text>
                                    </View>
                                </ScaleTouchable>
                            ))}
                        </View>

                        {/* Classroom Name */}
                        <Text style={styles.label}>{i18n.t('classroom.teacher.fieldClassroom')}</Text>
                        <TextInput
                            value={className}
                            onChangeText={setClassName}
                            placeholder={i18n.t('classroom.teacher.placeholderFieldClassroom')}
                            style={styles.textInput}
                            placeholderTextColor="#999"
                        />

                        {/* Select Subject */}
                        <Text style={styles.label}>{i18n.t('classroom.teacher.fieldSubject')}</Text>
                        <View style={styles.selectBox}>
                            {subjects.map((s) => (
                                <ScaleTouchable key={s._id} onPress={() => setSelectedSubject(s._id)}>
                                    <View
                                        style={[
                                            styles.optionItem,
                                            selectedSubject === s._id && styles.selectedItem,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                selectedSubject === s._id && styles.selectedText,
                                            ]}
                                        >
                                            {i18n.t(`subjects.${s.name}`)}
                                        </Text>
                                    </View>
                                </ScaleTouchable>
                            ))}
                        </View>



                        {/* Buttons */}
                        <View style={styles.buttonRow}>
                            <ScaleTouchable onPress={onClose}>
                                <View style={[styles.button, styles.cancelBtn]}>
                                    <Text style={styles.cancelText}>{i18n.t('classroom.teacher.btnCancel')}</Text>
                                </View>
                            </ScaleTouchable>
                            <ScaleTouchable onPress={onSave}>
                                <View style={[styles.button, styles.saveBtn]}>
                                    <Text style={styles.saveText}>{i18n.t('classroom.teacher.btnSave')}</Text>
                                </View>
                            </ScaleTouchable>
                        </View>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fefefe',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: -3 },
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 12,
    },
    label: {
        color: '#555',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        marginTop: 12,
    },
    textInput: {
        borderRadius: 10,
        padding: 10,
        color: '#333',
        fontSize: 14,
        borderWidth: 2,
        borderColor: '#D1D5DB',
    },
    selectBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionItem: {
        borderWidth: 1,
        borderBottomWidth: 2,
        borderColor: '#aaa',
        backgroundColor: '#E5E7EB',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedItem: {
        backgroundColor: '#58cc02',
        borderColor: '#4CAF50',
        borderWidth: 2,
        borderBottomWidth: 4,
    },
    optionText: {
        color: '#444',
    },
    selectedText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    cancelBtn: {
        marginRight: 8,
        borderWidth: 2,
        borderBottomWidth: 4,
        borderColor: '#D1D5DB',
        backgroundColor: '#E5E7EB',
    },
    saveBtn: {
        backgroundColor: '#f7b500',
        borderWidth: 2,
        borderBottomWidth: 4,
        borderColor: '#D97706',
    },
    cancelText: {
        color: '#333',
        fontWeight: '600',
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AnimatedModal;