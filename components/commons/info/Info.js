import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Image } from 'react-native';
import infoData from './infoData.json'; // Import the JSON file

const infoIcon = require('../../../assets/images/info.png'); // Import the icon from assets

const Info = ({ keyword }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const data = infoData[keyword];
    console.log(keyword, data);
    return (
        <View style={styles.infoContainer}>
            <TouchableOpacity style={styles.infoIcon} onPress={() => setModalVisible(true)}>
                <Image source={infoIcon} style={styles.iconImage} />
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.title}>{data.title}</Text>
                        <View style={styles.separator} />
                        <ScrollView style={styles.descriptionContainer}>
                            <Text style={styles.descriptionTitle}>{data.description.descriptionTitle}</Text>
                            <Text style={styles.descriptionContent}>{data.description.content}</Text>
                            <Text style={styles.descriptionNote}>{data.description.note}</Text>
                        </ScrollView>
                        <View style={styles.separator} />
                        <Text style={styles.accessText}>Access it from the highlighted option.</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        position: 'absolute',
        bottom: '10%',
        right: 20,
    },
    infoIcon: {
        backgroundColor: 'transparent',
        borderRadius: 50,
        padding: 0,
        elevation: 5,
    },
    iconImage: {
        width: 60,
        height: 60,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '90%',
        height: '60%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        color: '#0E5E9D',
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
        width: '100%',
    },
    descriptionContainer: {
        flex: 1,
        width: '100%',
    },
    descriptionTitle: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
    descriptionContent: {
        fontSize: 16,
        color: '#000',
    },
    descriptionNote: {
        fontSize: 16,
        color: '#000',
        fontStyle: 'italic',
    },
    accessText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#0E5E9D',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Info;