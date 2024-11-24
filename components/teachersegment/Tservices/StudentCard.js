import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import PropTypes from 'prop-types';

const StudentCard = ({ visible, data, subject, Max, onClose, onNext, isLast, onBack }) => {
    const [marks, setMarks] = useState('');

    const handleNext = () => {
        if (marks === '' || isNaN(marks) || parseInt(marks) > Max) {
            Alert.alert('Invalid Marks', `Please enter a valid mark between 0 and ${Max}.`);
            return;
        }
        onNext(marks);
        setMarks('');
    };

    const handleBack = () => {
        onBack();
        setMarks('');
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.card}>
                    <Text>Name: {data.STUDENT_NAME}</Text>
                    <Text>Subject: {subject}</Text>
                    <Text>Grade: {data.GRADE}</Text>
                    <Text>Section: {data.SECTION}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Marks"
                        value={marks}
                        onChangeText={setMarks}
                        keyboardType="numeric"
                        maxLength={3}
                    />
                    <View style={styles.buttonRow}>
                        <Button title="Back" onPress={handleBack} />
                        <Button title={isLast ? "Done" : "Next"} onPress={handleNext} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

StudentCard.propTypes = {
    visible: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    isLast: PropTypes.bool.isRequired,
    Max: PropTypes.number.isRequired,
    onBack: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    card: {
        width: 300,
        padding: 20,
        backgroundColor: '#E0F2FE',
        borderRadius: 10,
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        width: '100%',
        marginVertical: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default StudentCard;