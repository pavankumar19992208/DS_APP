import React, { useState, useContext } from 'react';
import { StyleSheet, View, TextInput, Button, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BaseUrlContext, UserDataContext } from '../../BaseUrlContext'; // Import the contexts
import img from '../../assets/images/p2p_logo.png';
import Help from './Help';
import Loader from '../commons/Loader'; // Import the Loader component
import Ionicons from '@expo/vector-icons/Ionicons'; // Import Ionicons
import RegisterTestUserModal from './RegisterTestUserModal'; // Import the RegisterTestUserModal component

export default function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loader visibility
    const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
    const baseUrl = useContext(BaseUrlContext); // Access the baseUrl from context
    const { setUserData } = useContext(UserDataContext); // Access the setUserData function from UserDataContext
    const navigation = useNavigation();

    const handleLogin = async () => {
        setLoading(true); // Show loader
        try {
            let url = '';
            let navigateTo = '';
            
            if (userId.startsWith('T')) {
                url = `${baseUrl}/teacher_login`;
                console.log(url);
                navigateTo = 'TeacherDashboard';
            } else if (userId.startsWith('Q')) {
                url = `${baseUrl}/testerlogin`;
                console.log(url);
                navigateTo = 'StudentDashboard';
            } else if (userId.startsWith('S')) {
                url = `${baseUrl}/st_login`;
                console.log(url);
                navigateTo = 'StudentDashboard';
            } else {
                throw new Error('Invalid User ID');
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // Store the response data in the UserDataContext
            setUserData(data);
            // Navigate to the appropriate dashboard with the response data
            console.log(data);
            navigation.navigate(navigateTo);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false); // Hide loader
        }
    };

    return (
        <View style={styles.container}>
            <Loader visible={loading} /> 
            <View style={styles.loginContainer}>
                {/* Logo */}
                <Image source={img} style={styles.logo} />
                {/* Inputs and Buttons Container */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputRow}>
                        <Ionicons name="person" size={20} color="#888" style={styles.icon} />
                        {/* User ID Input */}
                        <TextInput
                            style={styles.input}
                            placeholder="ENTER USER ID"
                            value={userId}
                            onChangeText={setUserId}
                            placeholderTextColor="#888" // Ensure placeholder text color is set
                        />
                    </View>
                    {/* Password Input */}
                    <View style={styles.inputRow}>
                        <Ionicons name="lock-closed" size={20} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="ENTER PASSWORD"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor="#888" // Ensure placeholder text color is set
                        />
                    </View>
                    {/* Login Button and Forgot Password */}
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => console.log('Forgot Password Pressed')} style={{ marginRight: 30 }}>
                            <Text style={styles.forgotPassword}>Forgot Password?</Text>
                        </TouchableOpacity>
                        <Button
                            title="LOGIN"
                            onPress={handleLogin}
                            style={{ marginRight: 5 }} // Add margin to the right of the button
                        />
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
            <RegisterTestUserModal visible={modalVisible} onClose={() => setModalVisible(false)} />
            <Help />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E0F2FE',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#424242', // Set border color
        marginBottom: 20,
    },
    loginContainer: {
        width: '80%',
        alignItems: 'center',
    },
    input: {
        textAlign: 'center',
        flex: 1,
        color: '#000', // Ensure entered text color is set
        fontSize: 16, // Ensure text size is set
        paddingVertical: 5,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50, // Circular shape
        marginBottom: 20,
        borderColor: '#1C79E399', // Border color
        borderWidth: 2, // Border weight
    },
    inputContainer: {
        width: '90%',
        height: 220,
        backgroundColor:'#CFE4F3B0',
        borderRadius: 30,
        borderColor: '#E31C6296',
        borderWidth: 2,
        padding: 10,
        justifyContent: 'center',
        padding: 20,
        marginBottom:100,
    },
    icon: {
        marginRight: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 10,
    },
    forgotPassword: {
        textDecorationLine: 'underline',
        marginTop: 15,
        marginLeft: 10,
        color: '#ED1111',
    },
    registerButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#0E5E9D',
        borderRadius: 5,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});