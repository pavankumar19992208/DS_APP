import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { Picker } from '@react-native-picker/picker';
import StudentCard from './StudentCard'; // Import the StudentCard component
import { Table, Row, Rows } from 'react-native-table-component';
import LottieView from 'lottie-react-native'; // Import LottieView
import AcknowledgmentCard from '../../commons/AcknowledgmentCard'; // Import AcknowledgmentCard
import { BaseUrlContext } from '../../../BaseUrlContext'; // Import the BaseUrlContext
import ScreenWrapper from '../../../ScreenWrapper'; // Import ScreenWrapper

export default function UploadMarksScreen({ route, navigation }) {
    const { data } = route.params;
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [students, setStudents] = useState([]);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [marksTable, setMarksTable] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const [modalVisible, setModalVisible] = useState(false); // State for AcknowledgmentCard visibility
    const [modalText, setModalText] = useState(''); // State for AcknowledgmentCard text
    const baseUrl = useContext(BaseUrlContext); // Use the BaseUrlContext
    const tableHead = ['R.No', 'Student Name', 'Marks'];
    const tableData = marksTable.map(row => [row.r_no, row.student_name, row.marks]);
    const columnWidths = [50, 200, 70]; 

    const handleExamChange = (exam) => {
        setSelectedExam(exam);
    };

    const handleSubmit = async () => {
        if (!data) {
            console.log(data);
            Alert.alert('Error', 'Data or teacher information is missing');
            return;
        }

        const payload = {
            grade: selectedGrade,
            section: selectedSection,
            schoolId: data.user.SCHOOL_ID,
        };
        console.log(payload);

        setLoading(true); // Start loading

        try {
            const response = await fetch(`${baseUrl}/stdetails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const responseData = await response.json();
            console.log(responseData);
            setStudents(responseData.students);

        
            if (!responseData.students[0].R_NO) {
                throw new Error('Generate roll numbers for this class first');
            }else{
                setIsModalVisible(true);
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleNextStudent = (marks) => {
        const student = students[currentStudentIndex];
        setMarksTable([...marksTable, { r_no: student.R_NO, student_name: student.STUDENT_NAME, marks }]);
        if (currentStudentIndex < students.length - 1) {
            setCurrentStudentIndex(currentStudentIndex + 1);
        } else {
            setIsModalVisible(false);
        }
    };

    const handleFinalSubmit = async () => {
        const payload = {
            schoolId: data.user.SCHOOL_ID,
            Tmarks: marksTable,
            exam: selectedExam,
            grade: selectedGrade,
            section: selectedSection,
            subject: selectedSubject,
        };
        console.log(payload);
        setLoading(true); // Start loading
        try {
            const response = await fetch(`${baseUrl}/upmarks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const responseData = await response.json();
            setModalText(responseData.message || 'something went wrong');
            setModalVisible(true);
            setMarksTable([]); // Clear the marks table
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleBack = () => {
        setMarksTable([]);
        setIsModalVisible(false);
    };

    if (!data || !data.user) {
        console.log(data);
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Data or teacher information is missing</Text>
            </View>
        );
    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {loading ? (
                    <LottieView
                        source={require('../../commons/jsonfiles/AniLoad.json')}
                        autoPlay
                        loop
                        style={styles.lottie}
                    />
                ) : (
                    <>
                        <View style={styles.container1}>
                            <View style={styles.row}>
                                <Picker
                                    selectedValue={selectedExam}
                                    style={styles.picker}
                                    onValueChange={handleExamChange}
                                >
                                    <Picker.Item label="Exam" value="" />
                                    <Picker.Item label="FA1 (ut-1)" value="FA1" />
                                    <Picker.Item label="FA2 (ut-2)" value="FA2" />
                                    <Picker.Item label="SA1 (halfyearly)" value="SA1" />
                                    <Picker.Item label="FA3 (ut-3)" value="FA3" />
                                    <Picker.Item label="FA4 (ut-4)" value="FA4" />
                                    <Picker.Item label="SA2 (FINAL)" value="SA2" />
                                </Picker>
                                <Picker
                                    selectedValue={selectedSubject}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => setSelectedSubject(itemValue)}
                                >
                                    <Picker.Item label="Subject" value="" />
                                    <Picker.Item label="ENGLISH" value="ENGLISH" />
                                    <Picker.Item label="TELUGU" value="TELUGU" />
                                    <Picker.Item label="HINDI" value="HINDI" />
                                    <Picker.Item label="MATHS" value="MATHS" />
                                    <Picker.Item label="SCIENCE" value="SCIENCE" />
                                    <Picker.Item label="SOCIAL" value="SOCIAL" />
                                </Picker>
                            </View>
                            <View style={styles.row}>
                                <Picker
                                    selectedValue={selectedGrade}
                                    style={styles.smallPicker}
                                    onValueChange={(itemValue) => setSelectedGrade(itemValue)}
                                >
                                    <Picker.Item label="Grade" value="" />
                                    <Picker.Item label="6" value="6" />
                                    <Picker.Item label="7" value="7" />
                                    <Picker.Item label="8" value="8" />
                                    <Picker.Item label="9" value="9" />
                                    <Picker.Item label="10" value="10" />
                                </Picker>
                                <Picker
                                    selectedValue={selectedSection}
                                    style={styles.smallPicker}
                                    onValueChange={(itemValue) => setSelectedSection(itemValue)}
                                >
                                    <Picker.Item label="SEC" value="" />
                                    <Picker.Item label="A" value="A" />
                                    <Picker.Item label="B" value="B" />
                                </Picker>
                                <View style={styles.buttonContainer}>
                                    <Button title="GO>>" onPress={handleSubmit} />
                                </View>
                            </View>
                        </View>
                        <ScrollView style={styles.tableContainer}>
                            <Table borderStyle={styles.tableBorder}>
                                <Row data={tableHead} style={styles.head} textStyle={styles.text} widthArr={columnWidths} />
                                <Rows data={tableData} textStyle={styles.text} widthArr={columnWidths} />
                            </Table>
                        </ScrollView>
                        <View style={styles.buttonContainer}>
                            <Button title="Submit" onPress={handleFinalSubmit} />
                        </View>
                        {students.length > 0 && (
                            <StudentCard
                                visible={isModalVisible}
                                subject={selectedSubject}
                                data={students[currentStudentIndex]}
                                onClose={() => setIsModalVisible(false)}
                                onNext={handleNextStudent}
                                isLast={currentStudentIndex === students.length - 1}
                                onBack={handleBack}
                            />
                        )}
                        <AcknowledgmentCard
                            visible={modalVisible}
                            text={modalText}
                            onClose={() => setModalVisible(false)}
                        />
                    </>
                )}
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E0F2FE',
        flex: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center', // Center content vertically
    },
    container1: {
        // backgroundColor: '#E0F2FE',
        paddingRight: 10,
        marginRight: 10,
        width: 320, // Set the width to match the table width
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    picker: {
        height: 50,
        width: 150,
        marginHorizontal: 10,
    },
    smallPicker: {
        height: 50,
        width: 100,
        marginHorizontal: 12,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    buttonContainer: {
        marginVertical: 10,
        marginHorizontal: 13,
        alignItems: 'center',
    },
    tableBorder: {
        borderWidth: 1,
        borderColor: '#c8e1ff',
    },
    text: {
        margin: 6,
        textAlign: 'center',
    },
    head: {
        height: 40,
        width: 320,
        backgroundColor: '#f1f8ff',
    },
    lottie: {
        width: 200,
        height: 150,
    },
    lottieBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.5,
    },
});