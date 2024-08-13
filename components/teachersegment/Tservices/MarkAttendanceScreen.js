import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MarkAttendanceScreen = () => (
    <View style={styles.container}>
        <Text style={styles.text}>Mark Attendance Screen</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
});

export default MarkAttendanceScreen;