import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Button, ScrollView, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const TeacherProfile = ({ route }) => {
    const { userData } = route.params;

    const parseJSON = (jsonString) => {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('JSON Parse error:', error);
            return {};
        }
    };

    const [profileData, setProfileData] = useState(userData.teacher);
    const [currentAddress, setCurrentAddress] = useState(parseJSON(profileData.currentAddress));
    const [permanentAddress, setPermanentAddress] = useState(parseJSON(profileData.permanentAddress));
    const [subjectSpecialization, setSubjectSpecialization] = useState(parseJSON(profileData.subjectSpecialization));
    const [experience, setExperience] = useState(profileData.experience.toString());
    const [dob, setDob] = useState(new Date(profileData.dob));
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleInputChange = (field, value) => {
        setProfileData({
            ...profileData,
            [field]: value,
        });
    };

    const handleAddressChange = (addressType, field, value) => {
        if (addressType === 'current') {
            setCurrentAddress({
                ...currentAddress,
                [field]: value,
            });
        } else if (addressType === 'permanent') {
            setPermanentAddress({
                ...permanentAddress,
                [field]: value,
            });
        }
    };

    const handleSave = () => {
        // Combine address fields into JSON strings
        const updatedProfileData = {
            ...profileData,
            currentAddress: JSON.stringify(currentAddress),
            permanentAddress: JSON.stringify(permanentAddress),
            subjectSpecialization: JSON.stringify(subjectSpecialization),
            experience: parseInt(experience, 10),
            dob: dob.toISOString().split('T')[0], // Save DOB as YYYY-MM-DD
        };

        // Handle save logic here, e.g., send updated data to backend
        console.log('Updated profile data:', updatedProfileData);
    };

    const renderDocuments = (documents) => {
        if (!documents || typeof documents !== 'object') {
            return <Text>No documents available</Text>;
        }

        return Object.keys(documents).map((key) => {
            const value = documents[key];
            if (value === null) {
                return (
                    <View key={key} style={styles.documentItem}>
                        <Text style={styles.documentKey}>{key}:</Text>
                        <Text style={styles.documentValue}>Not available</Text>
                    </View>
                );
            } else if (typeof value === 'string' && value.startsWith('http')) {
                return (
                    <View key={key} style={styles.documentItem}>
                        <Text style={styles.documentKey}>{key}:</Text>
                        <Text style={styles.documentValue} onPress={() => Linking.openURL(value)}>{value}</Text>
                    </View>
                );
            } else {
                return (
                    <View key={key} style={styles.documentItem}>
                        <Text style={styles.documentKey}>{key}:</Text>
                        <Text style={styles.documentValue}>{value}</Text>
                    </View>
                );
            }
        });
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dob;
        setShowDatePicker(Platform.OS === 'ios');
        setDob(currentDate);
        handleInputChange('dob', currentDate.toISOString().split('T')[0]);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Teacher Profile</Text>
                <Image
                    source={{ uri: profileData.profilePic }}
                    style={styles.profilePic}
                />
            </View>
            <View style={styles.profileContainer}>
                <View style={styles.detailsContainer}>
                    <Text style={styles.heading}>User ID:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.userid}
                        onChangeText={(value) => handleInputChange('userid', value)}
                    />
                    <Text style={styles.heading}>School ID:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.SchoolId}
                        onChangeText={(value) => handleInputChange('SchoolId', value)}
                    />
                    <Text style={styles.heading}>Full Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.fullName}
                        onChangeText={(value) => handleInputChange('fullName', value)}
                    />
                    <Text style={styles.heading}>Date of Birth:</Text>
                    <View style={styles.datePickerContainer}>
                        <TextInput
                            style={styles.inputWithIcon}
                            value={dob.toISOString().split('T')[0]}
                            onFocus={showDatePickerModal}
                        />
                        <TouchableOpacity onPress={showDatePickerModal} style={styles.iconContainer}>
                            <Icon name="calendar-today" size={25} color="gray" />
                        </TouchableOpacity>
                    </View>
                    {showDatePicker && (
                        <DateTimePicker
                            value={dob}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                    <Text style={styles.heading}>Gender:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.gender}
                        onChangeText={(value) => handleInputChange('gender', value)}
                    />
                    <Text style={styles.heading}>Contact Number:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.contactNumber}
                        onChangeText={(value) => handleInputChange('contactNumber', value)}
                    />
                    <Text style={styles.heading}>Email:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                    />
                    <Text style={styles.heading}>Current Address:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentAddress.city}
                        placeholder="City"
                        onChangeText={(value) => handleAddressChange('current', 'city', value)}
                    />
                    <TextInput
                        style={styles.input}
                        value={currentAddress.line1}
                        placeholder="Line 1"
                        onChangeText={(value) => handleAddressChange('current', 'line1', value)}
                    />
                    <TextInput
                        style={styles.input}
                        value={currentAddress.line2}
                        placeholder="Line 2"
                        onChangeText={(value) => handleAddressChange('current', 'line2', value)}
                    />
                    <TextInput
                        style={styles.input}
                        value={currentAddress.state}
                        placeholder="State"
                        onChangeText={(value) => handleAddressChange('current', 'state', value)}
                    />
                    
                    <TextInput
                        style={styles.input}
                        value={currentAddress.pincode}
                        placeholder="Pincode"
                        onChangeText={(value) => handleAddressChange('current', 'pincode', value)}
                    />
                    <TextInput
                        style={styles.input}
                        value={currentAddress.district}
                        placeholder="District"
                        onChangeText={(value) => handleAddressChange('current', 'district', value)}
                    />
                    <Text style={styles.heading}>Permanent Address:</Text>
                    <TextInput
                        style={styles.input}
                        value={permanentAddress.city}
                        placeholder="City"
                        onChangeText={(value) => handleAddressChange('permanent', 'city', value)}
                    />
                    <TextInput
                        style={styles.input}
                        value={permanentAddress.line1}
                        placeholder="Line 1"
                        onChangeText={(value) => handleAddressChange('permanent', 'line1', value)}
                    />
                    <TextInput
                        style={styles.input}
                        value={permanentAddress.line2}
                        placeholder="Line 2"
                        onChangeText={(value) => handleAddressChange('permanent', 'line2', value)}
                    />
                    
                    <TextInput
                        style={styles.input}
                        value={permanentAddress.state}
                        placeholder="State"
                        onChangeText={(value) => handleAddressChange('permanent', 'state', value)}
                    />
                    <TextInput
                        style={styles.input}
                        value={permanentAddress.pincode}
                        placeholder="Pincode"
                        onChangeText={(value) => handleAddressChange('permanent', 'pincode', value)}
                    />
                    <TextInput
                        style={styles.input}
                        value={permanentAddress.district}
                        placeholder="District"
                        onChangeText={(value) => handleAddressChange('permanent', 'district', value)}
                    />
                    
                    <Text style={styles.heading}>Position:</Text>
                    <Text style={styles.input}>{profileData.position}</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={profileData.position}
                            style={styles.picker}
                            onValueChange={(itemValue) => handleInputChange('position', itemValue)}
                        >
                            <Picker.Item label="Telugu" value="Telugu" />
                            <Picker.Item label="Hindi" value="Hindi" />
                            <Picker.Item label="English" value="English" />
                            <Picker.Item label="Maths" value="Maths" />
                            <Picker.Item label="Science" value="Science" />
                            <Picker.Item label="Social" value="Social" />
                        </Picker>
                    </View>
                    <Text style={styles.heading}>Subject Specialization:</Text>
                    <Text>{JSON.stringify(subjectSpecialization)}</Text>
                    <TextInput
                        style={styles.input}
                        value={JSON.stringify(subjectSpecialization)}
                        onChangeText={(value) => {
                            try {
                                setSubjectSpecialization(JSON.parse(value));
                            } catch (error) {
                                console.error('JSON Parse error:', error);
                            }
                        }}
                    />
                    <Text style={styles.heading}>Experience:</Text>
                    <TextInput
                        style={styles.input}
                        value={experience}
                        keyboardType="numeric"
                        onChangeText={(value) => setExperience(value)}
                    />
                    <Text style={styles.heading}>Qualification:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.qualification}
                        onChangeText={(value) => handleInputChange('qualification', value)}
                    />
                    <Text style={styles.heading}>Certifications:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.certifications}
                        onChangeText={(value) => handleInputChange('certifications', value)}
                    />
                    <Text style={styles.heading}>Joining Date:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.joiningDate}
                        onChangeText={(value) => handleInputChange('joiningDate', value)}
                    />
                    <Text style={styles.heading}>Employment Type:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.employmentType}
                        onChangeText={(value) => handleInputChange('employmentType', value)}
                    />
                    <Text style={styles.heading}>Previous School:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.previousSchool}
                        onChangeText={(value) => handleInputChange('previousSchool', value)}
                    />
                    <Text style={styles.heading}>Emergency Contact Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.emergencyContactName}
                        onChangeText={(value) => handleInputChange('emergencyContactName', value)}
                    />
                    <Text style={styles.heading}>Emergency Contact Number:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.emergencyContactNumber}
                        onChangeText={(value) => handleInputChange('emergencyContactNumber', value)}
                    />
                    <Text style={styles.heading}>Relationship to Teacher:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.relationshipToTeacher}
                        onChangeText={(value) => handleInputChange('relationshipToTeacher', value)}
                    />
                    <Text style={styles.heading}>Languages Known:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.languagesKnown}
                        onChangeText={(value) => handleInputChange('languagesKnown', value)}
                    />
                    <Text style={styles.heading}>Interests:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.interests}
                        onChangeText={(value) => handleInputChange('interests', value)}
                    />
                    <Text style={styles.heading}>Availability of Extra-Curricular Activities:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.availabilityOfExtraCirricularActivities}
                        onChangeText={(value) => handleInputChange('availabilityOfExtraCirricularActivities', value)}
                    />
                    <Text style={styles.heading}>Documents:</Text>
                    {renderDocuments(profileData.documents)}
                    <Text style={styles.heading}>Password:</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.password}
                        onChangeText={(value) => handleInputChange('password', value)}
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Save" onPress={handleSave} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 10,
    },
    profileContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    detailsContainer: {
        flex: 1,
    },
    heading: {
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginTop: 5,
        width: width - 32, // Adjust the width to fit the screen
    },
    inputWithIcon: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginTop: 5,
        width: 330, // Adjust the width to fit the screen and leave space for the icon
        paddingRight: 40, // Add padding to the right to avoid text overlap with the icon
    },
    iconContainer: {
        position: 'absolute',
        right: 15,
        top: 12,

    },
    datePickerContainer: {
        position: 'relative',
        width: width - 32,
    },
    pickerContainer: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 5,
        width: width - 32, // Adjust the width to fit the screen
    },
    picker: {
        height: 40,
        width: '100%',
    },
    profilePic: {
        width: 100,
        height: 120,
        borderRadius: 5,
        borderColor: 'pink',
        borderWidth: 2,
        marginLeft: 50,
        marginTop: 30,
    },
    documentItem: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    documentKey: {
        fontWeight: 'bold',
        marginRight: 4,
    },
    documentValue: {
        flex: 1,
        color: 'blue',
        textDecorationLine: 'underline',
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 50,
    },
});

export default TeacherProfile;