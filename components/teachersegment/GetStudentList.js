import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native'; 
import { BaseUrlContext } from '../../BaseUrlContext'; // Import the BaseUrlContext

const GetStudentListScreen = ({ visible, onClose, data, setStudentList }) => {
    const [selectedYear, setSelectedYear] = useState('2324');
    const [selectedGrade, setSelectedGrade] = useState('6');
    const [selectedSection, setSelectedSection] = useState('A');
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseTextColor, setResponseTextColor] = useState('red');
    const navigation = useNavigation();
    const baseUrl = useContext(BaseUrlContext); // Use the BaseUrlContext

    const handleGetList = async () => {
        setLoading(true);
        setResponseMessage('');
        setResponseTextColor('red');
        
        const details = {
            schoolId: data.teacher.SCHOOL_ID,
            year: selectedYear,
            grade: selectedGrade,
            section: selectedSection,
        };

        try {
            const response = await fetch(`${baseUrl}/stdetails`, { // Use the baseUrl from context
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(details),
            });
            const data1 = await response.json();
            console.log(data1);
            if (response.status === 200) {
                setResponseMessage(data.message);
                setResponseTextColor('green');
                
                setStudentList({ data: data1, schoolId: data.teacher.SCHOOL_ID, year: selectedYear, tdata: data });
                onClose();
                return;
            }
            setResponseMessage(data.detail[0].msg);
        } catch (error) {
            setResponseMessage('Error fetching student list');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {loading ? (
                        <LottieView
                            source={require('../commons/jsonfiles/AniLoad.json')}
                            autoPlay
                            loop
                            style={styles.lottie}
                        />   
                    ) : (
                        <>
                            <Text style={{ fontSize: 16, color: 'green' }}>Select year, grade, and section</Text>
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
                                <Button title="Get List" onPress={handleGetList} />
                                <Button title="Back" onPress={onClose} />
                            </View>
                            {responseMessage && (
                                <View style={styles.responseContainer}>
                                    <Text style={[styles.responseText, { color: responseTextColor }]}>{responseMessage}</Text>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: "90%",
        backgroundColor: '#E0F2FE',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 18,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: 150,
    },
    responseContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    responseText: {
        fontSize: 15,
        marginTop: 10,
    },
    lottie: {
        width: 150,
        height: 200,
    },
});

export default GetStudentListScreen;