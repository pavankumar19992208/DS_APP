import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Button, ScrollView, Dimensions, Platform, TouchableOpacity } from 'react-native';
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
    const [editableFields, setEditableFields] = useState({
        contactNumber: false,
        email: false,
        currentAddress: false,
        emergencyContactNumber: false,
        languagesKnown: false,
    });
    const [dob, setDob] = useState(new Date(profileData.dob));
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleInputChange = (field, value) => {
        setProfileData({
            ...profileData,
            [field]: value,
        });
    };

    const handleAddressChange = (field, value) => {
        setCurrentAddress({
            ...currentAddress,
            [field]: value,
        });
    };

    const handleSave = () => {
        const updatedProfileData = {
            ...profileData,
            currentAddress: JSON.stringify(currentAddress),
            dob: dob.toISOString().split('T')[0],
        };

        console.log('Updated profile data:', updatedProfileData);
    };

    const toggleEditable = (field) => {
        setEditableFields({
            ...editableFields,
            [field]: !editableFields[field],
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
                <Image
                    source={{ uri: profileData.profilePic }}
                    style={styles.profilePic}
                />
                <View style={styles.headerDetailsContainer}>
                    <Text style={styles.heading}>
                        USER ID: <Text style={styles.dataText}>{profileData.UserId}</Text>
                    </Text>
                    <Text style={styles.heading}>
                        SCHOOL ID: <Text style={styles.dataText}>{profileData.SchoolId}</Text>
                    </Text>
                    <Text style={styles.heading}>
                        FULL NAME: <Text style={styles.dataText}>{profileData.Name}</Text>
                    </Text>
                    <Text style={styles.heading}>
                        GENDER: <Text style={styles.dataText}>{profileData.gender}</Text>
                    </Text>
                </View>
            </View>
            <View style={styles.profileContainer}>
                <View style={styles.detailsContainer}>
                    <Text style={styles.heading}>Date of Birth:</Text>
                    <View style={styles.datePickerContainer}>
                        <Text style={styles.inputWithIcon}>{dob.toISOString().split('T')[0]}</Text>
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
                    <Text style={styles.heading}>Contact Number:</Text>
                    <View style={styles.inputWithIconContainer}>
                        {editableFields.contactNumber ? (
                            <TextInput
                                style={styles.inputWithIcon}
                                value={profileData.contactNumber}
                                onChangeText={(value) => handleInputChange('contactNumber', value)}
                            />
                        ) : (
                            <Text style={styles.inputWithIcon}>{profileData.contactNumber}</Text>
                        )}
                        <TouchableOpacity onPress={() => toggleEditable('contactNumber')} style={styles.iconContainer}>
                            <Icon name="edit" size={25} color="gray" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.heading}>Email:</Text>
                    <View style={styles.inputWithIconContainer}>
                        {editableFields.email ? (
                            <TextInput
                                style={styles.inputWithIcon}
                                value={profileData.email}
                                onChangeText={(value) => handleInputChange('email', value)}
                            />
                        ) : (
                            <Text style={styles.inputWithIcon}>{profileData.email}</Text>
                        )}
                        <TouchableOpacity onPress={() => toggleEditable('email')} style={styles.iconContainer}>
                            <Icon name="edit" size={25} color="gray" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.heading}>Current Address:</Text>
                    <View style={styles.inputWithIconContainer}>
                        {editableFields.currentAddress ? (
                            <TextInput
                                style={styles.inputWithIcon}
                                value={currentAddress.city}
                                placeholder="City"
                                onChangeText={(value) => handleAddressChange('city', value)}
                            />
                        ) : (
                            <Text style={styles.inputWithIcon}>{currentAddress.city}</Text>
                        )}
                        <TouchableOpacity onPress={() => toggleEditable('currentAddress')} style={styles.iconContainer}>
                            <Icon name="edit" size={25} color="gray" />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.input}
                        value={currentAddress.line1}
                        placeholder="Line 1"
                        onChangeText={(value) => handleAddressChange('line1', value)}
                        editable={editableFields.currentAddress}
                    />
                    <TextInput
                        style={styles.input}
                        value={currentAddress.line2}
                        placeholder="Line 2"
                        onChangeText={(value) => handleAddressChange('line2', value)}
                        editable={editableFields.currentAddress}
                    />
                    <TextInput
                        style={styles.input}
                        value={currentAddress.state}
                        placeholder="State"
                        onChangeText={(value) => handleAddressChange('state', value)}
                        editable={editableFields.currentAddress}
                    />
                    <TextInput
                        style={styles.input}
                        value={currentAddress.pincode}
                        placeholder="Pincode"
                        onChangeText={(value) => handleAddressChange('pincode', value)}
                        editable={editableFields.currentAddress}
                    />
                    <TextInput
                        style={styles.input}
                        value={currentAddress.district}
                        placeholder="District"
                        onChangeText={(value) => handleAddressChange('district', value)}
                        editable={editableFields.currentAddress}
                    />
                    <Text style={styles.heading}>Emergency Contact Number:</Text>
                    <View style={styles.inputWithIconContainer}>
                        {editableFields.emergencyContactNumber ? (
                            <TextInput
                                style={styles.inputWithIcon}
                                value={profileData.emergencyContactNumber}
                                onChangeText={(value) => handleInputChange('emergencyContactNumber', value)}
                            />
                        ) : (
                            <Text style={styles.inputWithIcon}>{profileData.emergencyContactNumber}</Text>
                        )}
                        <TouchableOpacity onPress={() => toggleEditable('emergencyContactNumber')} style={styles.iconContainer}>
                            <Icon name="edit" size={25} color="gray" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.heading}>Languages Known:</Text>
                    <View style={styles.inputWithIconContainer}>
                        {editableFields.languagesKnown ? (
                            <TextInput
                                style={styles.inputWithIcon}
                                value={profileData.languagesKnown}
                                onChangeText={(value) => handleInputChange('languagesKnown', value)}
                            />
                        ) : (
                            <Text style={styles.inputWithIcon}>{profileData.languagesKnown}</Text>
                        )}
                        <TouchableOpacity onPress={() => toggleEditable('languagesKnown')} style={styles.iconContainer}>
                            <Icon name="edit" size={25} color="gray" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.link}>Submitted Documents</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.link}>Change Password</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        borderWidth: 2, // Add border width
        borderColor: 'gray', // Add border color
        borderRadius: 10, // Optional: Add border radius for rounded corners
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerDetailsContainer: {
        marginLeft: 20,
        flex: 1,
        marginTop: 50,
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
        marginBottom: 5,
    },
    dataText: {
        fontWeight: 'normal',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginTop: 5,
        width: width - 32,
    },
    inputWithIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center horizontally
    },
    inputWithIcon: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginTop: 5,
        width: width - 32,
        paddingRight: 40,
        textAlignVertical: 'center', // Center text vertically
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
        width: width - 32,
    },
    picker: {
        height: 40,
        width: '100%',
    },
    profilePic: {
        width: 100,
        height: 120,
        borderRadius: 10,
        borderColor: 'pink',
        borderWidth: 2,
        marginTop: 40,
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
        marginTop: 8,
        marginBottom: 50,
        alignItems: 'center',
    },
    link: {
        color: 'red',
        textDecorationLine: 'underline',
        marginBottom: 10,
        
    },
    saveButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 120,
        borderRadius: 15,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TeacherProfile;