import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BaseUrlContext, UserDataContext } from '../../../BaseUrlContext';
import ScreenWrapper from '../../../ScreenWrapper';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon
import AcknowledgmentCard from '../../commons/AcknowledgmentCard'; // Import the AcknowledgmentCard component

const MarkAttendanceScreen = ({ data }) => {
    const [selectedGrade, setSelectedGrade] = useState('6');
    const [selectedSection, setSelectedSection] = useState('A');
    const [students, setStudents] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [attendance, setAttendance] = useState([]);
    const [ackVisible, setAckVisible] = useState(false); // State to manage the visibility of AcknowledgmentCard
    const [ackText, setAckText] = useState(''); // State to manage the text of AcknowledgmentCard

    const baseUrl = useContext(BaseUrlContext); // Access the baseUrl from context
    const { userData } = useContext(UserDataContext); // Access userData from UserDataContext

    const handleTakeAttendance = async () => {
        console.log("gg", userData);
        const details = {
            schoolId: userData.user.SCHOOL_ID,
            year: '2324',
            grade: selectedGrade,
            section: selectedSection,
        };

        try {
            const response = await fetch(`${baseUrl}/stdetails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(details),
            });
            const data = await response.json();
            setStudents(data.students); // Access the students array from the response

            setModalVisible(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch student list');
        }
    };

    const handleSubmitAttendance = async () => {
        const attendanceDetails = attendance.map(item => ({
            student_id: item.student_id,
            date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
            status: item.status,
            remarks: item.remarks || null,
            recorded_by: userData.user.TEACHER_ID,
        }));

        try {
            console.log("att", attendanceDetails);
            await fetch(`${baseUrl}/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ attendance: attendanceDetails }),
            });
            setAckText(`Attendance submitted successfully for Grade: ${selectedGrade}, Section: ${selectedSection} on ${new Date().toISOString().split('T')[0]}`);
            setAckVisible(true); // Show the AcknowledgmentCard
        } catch (error) {
            Alert.alert('Error', 'Failed to submit attendance');
        }
    };

    const handleNextStudent = (status) => {
        const student = students[currentStudentIndex];
        const updatedAttendance = [...attendance];
        const existingIndex = updatedAttendance.findIndex(item => item.student_id === student.R_NO);

        if (existingIndex !== -1) {
            updatedAttendance[existingIndex].status = status;
        } else {
            updatedAttendance.push({ student_id: student.R_NO, name: student.STUDENT_NAME, status });
        }

        setAttendance(updatedAttendance);

        if (currentStudentIndex < students.length - 1) {
            setCurrentStudentIndex(currentStudentIndex + 1);
        } else {
            setModalVisible(false);
        }
    };

    const handlePreviousStudent = () => {
        if (currentStudentIndex > 0) {
            setCurrentStudentIndex(currentStudentIndex - 1);
        }
    };

    const handleStatusChange = (index) => {
        Alert.alert(
            'Change Status',
            'Select status:',
            [
                {
                    text: 'P',
                    onPress: () => updateStatus(index, 'P'),
                },
                {
                    text: 'AB',
                    onPress: () => updateStatus(index, 'AB'),
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    const updateStatus = (index, status) => {
        const updatedAttendance = [...attendance];
        updatedAttendance[index].status = status;
        setAttendance(updatedAttendance);
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.row}>
                    <Picker
                        selectedValue={selectedGrade}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedGrade(itemValue)}
                    >
                        <Picker.Item label="6" value="6" />
                        <Picker.Item label="7" value="7" />
                        <Picker.Item label="8" value="8" />
                        <Picker.Item label="9" value="9" />
                        <Picker.Item label="10" value="10" />
                    </Picker>
                    <Picker
                        selectedValue={selectedSection}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedSection(itemValue)}
                    >
                        <Picker.Item label="A" value="A" />
                        <Picker.Item label="B" value="B" />
                    </Picker>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleTakeAttendance}>
                    <Text style={styles.buttonText}>Take Attendance</Text>
                </TouchableOpacity>
                <FlatList
                    data={attendance}
                    keyExtractor={(item) => item.student_id.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>{item.student_id}</Text>
                            <Text style={styles.tableCell}>{item.name}</Text>
                            <TouchableOpacity
                                style={[styles.tableCell, styles.statusCell]}
                                onPress={() => handleStatusChange(index)}
                            >
                                <Text style={{ color: item.status === 'P' ? 'green' : 'red' }}>{item.status}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListHeaderComponent={() => (
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderCell}>R.No</Text>
                            <Text style={styles.tableHeaderCell}>Name</Text>
                            <Text style={styles.tableHeaderCell}>Status</Text>
                        </View>
                    )}
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmitAttendance}>
                    <Text style={styles.buttonText}>Submit Attendance</Text>
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {students.length > 0 && (
                                <>
                                    <Text style={styles.modalText}>{students[currentStudentIndex].STUDENT_NAME}</Text>
                                    <Text style={styles.modalText}>
                                        Roll No: {students[currentStudentIndex].R_NO}, Grade: {selectedGrade}, Section: {selectedSection}
                                    </Text>
                                    <View style={styles.row}>
                                        <TouchableOpacity
                                            style={styles.backButton}
                                            onPress={handlePreviousStudent}
                                        >
                                            <Icon name="arrow-back" size={24} color="#FFF" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.presentButton]}
                                            onPress={() => handleNextStudent('P')}
                                        >
                                            <Text style={styles.buttonText}>P</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.absentButton]}
                                            onPress={() => handleNextStudent('AB')}
                                        >
                                            <Text style={styles.buttonText}>AB</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
                <AcknowledgmentCard
                    visible={ackVisible}
                    text={ackText}
                    onClose={() => setAckVisible(false)}
                />
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    picker: {
        flex: 1,
        height: 50,
    },
    button: {
        backgroundColor: '#3C70D8',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
        padding: 10,
    },
    tableHeaderCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center', // Center text horizontally
    },
    tableRow: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableCell: {
        flex: 1,
        textAlign: 'center', // Center text horizontally
        justifyContent: 'center', // Center text vertically
    },
    statusCell: {
        alignItems: 'center', // Center items horizontally
        justifyContent: 'center', // Center items vertically
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
        width: '35%',
    },
    presentButton: {
        backgroundColor: 'green',
        marginRight: 10,
    },
    absentButton: {
        backgroundColor: 'red',
    },
    backButton: {
        backgroundColor: '#3C70D8',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
        marginRight: 10,
    },
});

export default MarkAttendanceScreen;