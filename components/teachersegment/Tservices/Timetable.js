import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, FlatList, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Timetable = () => {
    const [editSession, setEditSession] = useState(null);
    const [editText, setEditText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const data = [
        { session: 1, timing: '9:00 AM - 10:00 AM', class: 'Grade 6A', subject: 'Maths' },
        { session: 2, timing: '10:00 AM - 11:00 AM', class: 'Grade 6B', subject: 'Telugu' },
        { session: 3, timing: '11:00 AM - 12:00 PM', class: 'Grade 7A', subject: 'Maths' },
        { session: 4, timing: '1:00 PM - 2:00 PM', class: 'Grade 7B', subject: 'Telugu' },
        { session: 5, timing: '2:00 PM - 3:00 PM', class: 'Grade 8A', subject: 'Maths' },
        { session: 6, timing: '3:00 PM - 4:00 PM', class: 'Grade 8B', subject: 'Telugu' },
    ];

    const handleEdit = (session) => {
        setEditSession(session);
        setEditText('');
        setModalVisible(true);
    };

    const handleSubmit = () => {
        // Handle the submit logic here
        setEditSession(null);
        setModalVisible(false);
    };

    const renderRow = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.session}</Text>
            <Text style={styles.cell}>{item.timing}</Text>
            <Text style={styles.cell}>{item.class}</Text>
            <Text style={styles.cell}>{item.subject}</Text>
            <TouchableOpacity onPress={() => handleEdit(item.session)}>
                <Icon name="edit" size={24} color="#E31C62" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.headerCell}>Session</Text>
                <Text style={styles.headerCell}>Timing</Text>
                <Text style={styles.headerCell}>Class</Text>
                <Text style={styles.headerCell}>Subject</Text>
                <Text style={styles.headerCell}>Update</Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderRow}
                keyExtractor={(item) => item.session.toString()}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            value={editText}
                            onChangeText={setEditText}
                            placeholder="Enter new value"
                        />
                        <Button title="Submit" onPress={handleSubmit} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#E0F2FE',
        padding: 10,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    cell: {
        flex: 1,
        textAlign: 'left',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
    },
});

export default Timetable;