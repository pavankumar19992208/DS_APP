import React from 'react';
import { StyleSheet, View, TextInput, Button, TouchableOpacity, Text, Image } from 'react-native';
import img from '../../assets/images/large-dNk4O_UUZ-transformed (1).png'

export default function Login() {
    return (
        <View style={styles.container}>
            <View style={styles.loginContainer}>
                {/* Logo */}
                <Image source={img} style={styles.logo} />
                {/* Inputs and Buttons Container */}
                <View style={styles.inputContainer}>
                    {/* User ID Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="ENTER USER ID"
                    />
                    {/* Password Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="ENTER PASSWORD"
                        secureTextEntry={true}
                    />
                    {/* Login Button and Forgot Password */}
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => console.log('Forgot Password Pressed')} style={{ marginRight: 30 }}>
                            <Text style={styles.forgotPassword}>Forgot Password?</Text>
                        </TouchableOpacity>
                        <Button
                            title="LOGIN"
                            onPress={() => console.log('Login Pressed')}
                            style={{ marginRight: 5 }} // Add margin to the right of the button
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
        borderColor: '#e31c60', // Border color
        borderWidth: 2, // Border weight
    },
    inputContainer: {
        width: '90%',
        height: 220,
        borderRadius: 30,
        borderColor: '#e31c60',
        borderWidth: 2,
        padding: 10,
        justifyContent: 'center',
        padding:20,
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
        color:'#ED1111',
    },
});