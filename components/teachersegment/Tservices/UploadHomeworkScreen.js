import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { BaseUrlContext, UserDataContext } from '../../../BaseUrlContext';
import ScreenWrapper from '../../../ScreenWrapper';
import { storage } from '../../connections/Firebase'; // Import the storage object from your Firebase configuration
import { MaterialIcons } from '@expo/vector-icons'; // Import icon library
import AcknowledgmentCard from '../../commons/AcknowledgmentCard'; // Import the AcknowledgmentCard component

const UploadHomeWork = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [assignedDate, setAssignedDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [priority, setPriority] = useState(false);
    const [gradingPoints, setGradingPoints] = useState('');
    const [showAssignedDatePicker, setShowAssignedDatePicker] = useState(false);
    const [showDueDatePicker, setShowDueDatePicker] = useState(false);
    const [ackVisible, setAckVisible] = useState(false); // State to manage the visibility of AcknowledgmentCard

    const baseUrl = useContext(BaseUrlContext); // Access the baseUrl from context
    const { userData } = useContext(UserDataContext); // Access userData from UserDataContext

    const handleFileUpload = async () => {
        let result = await DocumentPicker.getDocumentAsync({});
        console.log("DocumentPicker result:", result);
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const file = result.assets[0];
            console.log("File picked:", file);
            setAttachments(prevAttachments => [...prevAttachments, file]);
        } else {
            console.log("File picking cancelled or failed");
        }
    };

    const handleFileUploadToFirebase = async () => {
        try {
            const uploadPromises = attachments.map(async (file) => {
                const response = await fetch(file.uri);
                const blob = await response.blob();
                const storageRef = ref(storage, `homework/${file.name}`);
                await uploadBytes(storageRef, blob);
                const downloadURL = await getDownloadURL(storageRef);
                console.log(`Uploaded file: ${file.name}`); // Log the uploaded filename
                return { ...file, downloadURL };
            });

            const uploadedFiles = await Promise.all(uploadPromises);
            setAttachments(uploadedFiles);
            Alert.alert('Success', 'Files uploaded to Firebase successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to upload files to Firebase');
        }
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!title) {
            Alert.alert('Error', 'Please enter the homework title.');
            return;
        }
        if (!subject) {
            Alert.alert('Error', 'Please select a subject.');
            return;
        }
        if (!selectedClass) {
            Alert.alert('Error', 'Please select a class.');
            return;
        }
        if (!selectedSection) {
            Alert.alert('Error', 'Please select a section.');
            return;
        }
        if (!description) {
            Alert.alert('Error', 'Please enter the description.');
            return;
        }

        const homeworkData = {
            SchoolId: userData.teacher.SCHOOL_ID,
            Class_: selectedClass,
            Sec: selectedSection,
            Subject: subject,
            HomeWork: {
                title,
                description,
                attachments: JSON.stringify(attachments.map(file => ({ name: file.name, url: file.downloadURL })))
            },
            CreatedAt: assignedDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
            DueDate: dueDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
            UpdatedBy: userData.teacher.TEACHER_ID
        };

        try {
            const response = await fetch(`${baseUrl}/homework`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(homeworkData),
            });

            if (response.ok) {
                setAckVisible(true); // Show the AcknowledgmentCard
            } else {
                const errorData = await response.json();
                Alert.alert('Error', `Failed to upload homework: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to upload homework');
        }
    };

    const renderForm = () => (
        <View style={styles.container}>
            <Text style={styles.label}>Homework Title</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter Homework Title"
            />

            <Text style={styles.label}>Subject</Text>
            <Picker
                selectedValue={subject}
                style={styles.picker}
                onValueChange={(itemValue) => setSubject(itemValue)}
            >
                <Picker.Item label="Select Subject" value="" />
                {userData.teacher.subjects.map((subject, index) => (
                    <Picker.Item key={index} label={subject} value={subject} />
                ))}
            </Picker>

            <View style={styles.row}>
                <View style={styles.halfWidth}>
                    <Text style={styles.label}>Class</Text>
                    <Picker
                        selectedValue={selectedClass}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedClass(itemValue)}
                    >
                        <Picker.Item label="Select Class" value="" />
                        <Picker.Item label="6" value="6" />
                        <Picker.Item label="7" value="7" />
                        <Picker.Item label="8" value="8" />
                        <Picker.Item label="9" value="9" />
                        <Picker.Item label="10" value="10" />
                    </Picker>
                </View>
                <View style={styles.halfWidth}>
                    <Text style={styles.label}>Section</Text>
                    <Picker
                        selectedValue={selectedSection}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedSection(itemValue)}
                    >
                        <Picker.Item label="A" value="A" />
                        <Picker.Item label="B" value="B" />
                    </Picker>
                </View>
            </View>

            <Text style={styles.label}>Assigned Date</Text>
            <TouchableOpacity onPress={() => setShowAssignedDatePicker(true)}>
                <Text style={styles.dateText}>{assignedDate.toDateString()}</Text>
            </TouchableOpacity>
            {showAssignedDatePicker && (
                <DateTimePicker
                    value={assignedDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                        setShowAssignedDatePicker(false);
                        if (date) setAssignedDate(date);
                    }}
                />
            )}

            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity onPress={() => setShowDueDatePicker(true)}>
                <Text style={styles.dateText}>{dueDate.toDateString()}</Text>
            </TouchableOpacity>
            {showDueDatePicker && (
                <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                        setShowDueDatePicker(false);
                        if (date) setDueDate(date);
                    }}
                />
            )}

            <Text style={styles.label}>Description/Instructions</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter detailed instructions"
                multiline
            />

            <Text style={styles.label}>Attachments (optional)</Text>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.chooseFileButton} onPress={handleFileUpload}>
                    <MaterialIcons name="attach-file" size={24} color="black" />
                    <Text style={styles.chooseFileButtonText}>Choose File</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleFileUploadToFirebase}>
                    <Text style={styles.buttonText}>Upload</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={attachments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.attachmentItem}>
                        <Text style={styles.attachmentText}>{item.name}</Text>
                    </View>
                )}
            />
        </View>
    );

    return (
        <ScreenWrapper>
            <FlatList
                data={[{ key: 'form' }]}
                renderItem={({ item }) => renderForm()}
                keyExtractor={(item) => item.key}
            />
            <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, { marginLeft: 10 }]} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
            <AcknowledgmentCard
                visible={ackVisible}
                text="Homework uploaded successfully!"
                onClose={() => {
                    setAckVisible(false);
                    navigation.goBack();
                }}
            />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
    },
    dateText: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        color: '#000',
    },
    button: {
        backgroundColor: '#3C70D8',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 1,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 0,
    },
    chooseFileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 1,
    },
    chooseFileButtonText: {
        marginLeft: 5,
        fontSize: 16,
        color: 'black',
    },
    attachmentItem: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 5,
    },
    attachmentText: {
        color: '#000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        flex: 1,
        marginRight: 10,
    },
});

export default UploadHomeWork;