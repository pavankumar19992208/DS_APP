import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { Picker } from '@react-native-picker/picker';
import StudentCard from './StudentCard'; // Import the StudentCard component
import { Table, Row, Rows } from 'react-native-table-component';
import LottieView from 'lottie-react-native'; // Import LottieView
import AcknowledgmentCard from '../../commons/AcknowledgmentCard'; // Import AcknowledgmentCard
import { BaseUrlContext } from '../../../BaseUrlContext'; // Import the BaseUrlContext

export default function UploadMarksScreen({ route, navigation }) {
    const { data } = route.params;
    const [selectedYear, setSelectedYear] = useState('2324');
    const [selectedGrade, setSelectedGrade] = useState('6');
    const [selectedSection, setSelectedSection] = useState('A');
    const [selectedExam, setSelectedExam] = useState('FA1');
    const [selectedSubject, setSelectedSubject] = useState('ENGLISH');
    const [maxMarks, setMaxMarks] = useState('20');
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
        setMaxMarks(exam.startsWith('FA') ? '20' : '100');
    };

    const handleSubmit = async () => {
        if (!data) {
            console.log(data);
            Alert.alert('Error', 'Data or teacher information is missing');
            return;
        }

        const payload = {
            year: selectedYear,
            grade: selectedGrade,
            section: selectedSection,
            schoolId: data.teacher.SCHOOL_ID,
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
            schoolId: data.teacher.SCHOOL_ID,
            year: selectedYear,
            Tmarks: marksTable,
            exam:selectedExam,
            grade:selectedGrade,
            section:selectedSection,
            subject:selectedSubject,
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
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    if (!data || !data.teacher) {
        console.log(data);
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Data or teacher information is missing</Text>
            </View>
        );
    }

    return (
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
                    <LottieView
                source={require('../../commons/jsonfiles/bg2.json')} // Adjust the path to your Lottie file
                autoPlay
                loop
                style={styles.lottieBackground}
            />
                        <View style={styles.headerRow}>
                            <Text style={styles.headerText}>{data.teacher.TEACHER_NAME}</Text>
                            <Picker
                                selectedValue={selectedYear}
                                style={styles.picker}
                                onValueChange={(itemValue) => setSelectedYear(itemValue)}
                            >
                                <Picker.Item label="23-24" value="2324" />
                                <Picker.Item label="22-23" value="2223" />
                                <Picker.Item label="21-22" value="2122" />
                                <Picker.Item label="20-21" value="2021" />
                                <Picker.Item label="19-20" value="1920" />
                            </Picker>
                        </View>
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
                        <View style={styles.row}>
                            <Picker
                                selectedValue={selectedExam}
                                style={styles.picker}
                                onValueChange={handleExamChange}
                            >
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
                                <Picker.Item label="ENGLISH" value="ENGLISH" />
                                <Picker.Item label="TELUGU" value="TELUGU" />
                                <Picker.Item label="HINDI" value="HINDI" />
                                <Picker.Item label="MATHS" value="MATHS" />
                                <Picker.Item label="SCIENCE" value="SCIENCE" />
                                <Picker.Item label="SOCIAL" value="SOCIAL" />
                            </Picker>
                        </View>
                        <View style={styles.row}>
                            <Text>Max Marks:</Text>
                            <TextInput
                                style={styles.input}
                                value={maxMarks}
                                editable={false}
                            />
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
                            Max={parseInt(maxMarks, 10)}
                            data={students[currentStudentIndex]}
                            onClose={() => setIsModalVisible(false)}
                            onNext={handleNextStudent}
                            isLast={currentStudentIndex === students.length - 1}
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
        backgroundColor: '#E0F2FE',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        margin: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        marginRight: 10,
    },
    picker: {
        height: 20,
        width: 150,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        height: 30,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        width: 50,
        marginRight: 50
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    buttonContainer: {
        marginRight: 40,
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