// Login.js
import React, { useState, useContext } from 'react';
import { StyleSheet, View, TextInput, Button, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BaseUrlContext } from '../../BaseUrlContext';
import img from '../../assets/images/large-dNk4O_UUZ-transformed (1).png';
import Help from './Help';
import Loader from '../commons/Loader'; // Import the Loader component

export default function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loader visibility
    const baseUrl = useContext(BaseUrlContext); // Access the baseUrl from context
    const navigation = useNavigation();
    //updated
    const handleLogin = async () => {
        setLoading(true); // Show loader
        try {
            let url = '';
            let navigateTo = '';

            if (userId.startsWith('T')) {
                url = `${baseUrl}/teacher_login`;
                console.log(url);
                navigateTo = 'TeacherDashboard';
            } else if (userId.startsWith('S')) {
                url = `${baseUrl}/st_login`;
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
            // Navigate to the appropriate dashboard with the response data
            console.log(data);
            navigation.navigate(navigateTo, { data });
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
                    {/* User ID Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="ENTER USER ID"
                        value={userId}
                        onChangeText={setUserId}
                    />
                    {/* Password Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="ENTER PASSWORD"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />
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
    loginContainer: {
        width: '80%',
        alignItems: 'center',
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
        borderRadius: 30,
        borderColor: '#E31C6296',
        borderWidth: 2,
        padding: 10,
        justifyContent: 'center',
        padding: 20,
        marginBottom:100,
    },
    input: {
        height: 40,
        width: 200, // Ensure both inputs have the same width
        margin: 12,
        borderWidth: 1,
        borderColor: '#424242', // Set border color
        padding: 10,
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
});