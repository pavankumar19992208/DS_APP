import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { useNavigation } from '@react-navigation/native';
import GetStudentListScreen from '../GetStudentList';
import LottieView from 'lottie-react-native';
import { Picker } from '@react-native-picker/picker';
import ReportCardModal from './ReportCard';
import { BaseUrlContext } from '../../../BaseUrlContext'; // Import the BaseUrlContext

const ReportCardScreen = ({ route }) => {
    const navigation = useNavigation();
    const { tedata } = route.params;
    console.log(tedata);
    const [studentList, setStudentList] = useState(null);
    const [modalVisible, setModalVisible] = useState(true);
    const [pickerModalVisible, setPickerModalVisible] = useState(false);
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedExam, setSelectedExam] = useState('FA1');
    const [selectedYear, setSelectedYear] = useState('2324');
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const baseUrl = useContext(BaseUrlContext); // Use the BaseUrlContext

    useEffect(() => {
        if (studentList && studentList.data && studentList.data.students) {
            setModalVisible(false);
            const hasNullRollNumber = studentList.data.students.some(student => student.R_NO === null);
            if (hasNullRollNumber) {
                setErrorMessage('Generate roll numbers for this class first');
            }
        }
    }, [studentList]);

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setPickerModalVisible(true);
    };

    const handleGetReport = async () => {
        const payload = {
            exam: selectedExam,
            studentId: selectedStudent.STUDENT_ID,
            schoolId: tedata.user.SCHOOL_ID,
            year: selectedYear,
        };
        console.log(payload);
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/acreport`, { // Use the baseUrl from context
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Marks not yet updated for ${selectedExam} ${selectedYear} `);
            }

            const data1 = await response.json();
            console.log('Response data:', data1);

            if (!data1 || Object.keys(data1).length === 0) {
                throw new Error(`Marks not yet updated for ${selectedExam} ${selectedYear}`);
            }

            setReportData(data1);
            setReportModalVisible(true);
            setPickerModalVisible(false);
        } catch (error) {
            console.error('Error fetching report:', error);
            alert(error.message); // Display the error message to the user
        } finally {
            setLoading(false);
        }
    };

    const tableHead = ['R.No', 'Student ID', 'Name'];
    const tableData = studentList && studentList.data && studentList.data.students ? studentList.data.students.map((student) => [
        student.R_NO,
        <TouchableOpacity onPress={() => handleStudentSelect(student)} style={styles.link}>
            <Text style={styles.linkText}>{student.STUDENT_ID}</Text>
        </TouchableOpacity>,
        student.STUDENT_NAME
    ]) : [];
    const columnWidths = [50, 120, 180];

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : studentList && studentList.data && studentList.data.students ? (
                    <>
                        <Text style={styles.title}>CLICK ON STUDENT ID TO GET REPORT </Text>
                        <Table borderStyle={styles.tableBorder}>
                            <Row data={tableHead} style={styles.head} textStyle={styles.text} widthArr={columnWidths} />
                            <Rows data={tableData} textStyle={styles.text} widthArr={columnWidths} />
                        </Table>
                    </>
                ) : (
                    <>
                     <Text style={styles.title1}>YOU ARE OUT OF SESSION , GO BACK AND CONTINUE </Text>

                    <LottieView
                        source={require('../../commons/jsonfiles/AniLoad.json')}
                        autoPlay
                        loop
                        style={styles.lottie}
                    />
                    </>  
                )}
                <View style={{ marginBottom: 10 }}></View>  
            </View>
            <GetStudentListScreen
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                data={tedata}
                setStudentList={setStudentList}
            />
            <Modal
                visible={pickerModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setPickerModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Exam and Year</Text>
                        <Picker
                            selectedValue={selectedExam}
                            style={styles.picker}
                            onValueChange={(itemValue) => setSelectedExam(itemValue)}
                        >
                            <Picker.Item label="FA1 (ut-1)" value="FA1" />
                            <Picker.Item label="FA2 (ut-2)" value="FA2" />
                            <Picker.Item label="SA1 (halfyearly)" value="SA1" />
                            <Picker.Item label="FA3 (ut-3)" value="FA3" />
                            <Picker.Item label="FA4 (ut-4)" value="FA4" />
                            <Picker.Item label="SA2 (FINAL)" value="SA2" />
                        </Picker>
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
                        {loading ? (
                            <LottieView
                                source={require('../../commons/jsonfiles/AniLoad.json')}
                                autoPlay
                                loop
                                style={styles.lottie}
                            />
                        ) : (
                            <Button title="Get Report" onPress={handleGetReport} />
                        )}
                    </View>
                </View>
            </Modal>
            <ReportCardModal
                visible={reportModalVisible}
                onClose={() => setReportModalVisible(false)}
                data={reportData}
                exam={selectedExam}
                studentName={selectedStudent?.STUDENT_NAME}
                sgrade={studentList?.data?.students[0]?.GRADE}
                section={studentList?.data?.students[0]?.SECTION}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: '#E0F2FE',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        marginBottom: 10,
        color:'#E86A88',
        fontFamily: 'Source Code Pro',
    },
    title1: {
        fontSize: 14,
        color:'#E86A88',
    },
    head: {
        height: 40,
        backgroundColor: '#f1f8ff',
    },
    tableBorder: {
        borderWidth: 1,
        borderColor: '#c8e1ff',
    },
    text: {
        margin: 6,
        textAlign: 'center',
    },
    link: {
        textDecorationLine: 'underline',
        alignItems: 'center',
    },
    linkText: {
        color: 'blue',
    },
    lottie: {
        width: 200,
        height: 150,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#E0F2FE',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    picker: {
        width: 250,
        height: 50,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 10,
    },
});

export default ReportCardScreen;