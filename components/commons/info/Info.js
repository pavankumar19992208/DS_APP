import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Image } from 'react-native';
import infoData from './infoData.json'; // Import the JSON file

const infoIcon = require('../../../assets/images/info.png'); // Import the icon from assets

const Info = ({ keyword }) => {
    const [modalVisible, setModalVisible] = useState(true);
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
                        <Text style={styles.noticeText}>A card for pitching purpose, not for production APK</Text>
                        <Text style={styles.title}>{data.title}</Text>
                        <View style={styles.separator} />
                        <ScrollView style={styles.descriptionContainer}>
                            <Text style={styles.descriptionTitle}>{data.description.descriptionTitle}</Text>
                            <Text style={styles.descriptionContent}>{data.description.content}</Text>
                            {data.description.features && (
                                <>
                                    <Text style={styles.sectionTitle}>Features:</Text>
                                    {data.description.features.map((feature, index) => (
                                        <View key={index} style={styles.featureItem}>
                                            <Text style={styles.featureTitle}>{feature.title}</Text>
                                            <Text style={styles.featureContent}>{feature.content}</Text>
                                        </View>
                                    ))}
                                </>
                            )}
                            {data.description.outcomes && (
                                <>
                                    <Text style={styles.sectionTitle}>Outcomes:</Text>
                                    {data.description.outcomes.map((outcome, index) => (
                                        <View key={index} style={styles.outcomeItem}>
                                            <Text style={styles.outcomeTitle}>{outcome.title}</Text>
                                            <Text style={styles.outcomeContent}>{outcome.content}</Text>
                                        </View>
                                    ))}
                                </>
                            )}
                        </ScrollView>
                        <View style={styles.separator} />
                        <Text style={styles.accessText}>Access it from navbar (highlighted one).</Text>
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
        height: '75%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
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
    noticeText: {
        fontSize: 14,
        color: 'red',
        textAlign: 'center',
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
        padding:15,
    },
    descriptionTitle: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
    descriptionContent: {
        fontSize: 16,
        color: '#000',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#0E5E9D',
        fontWeight: 'bold',
        marginTop: 10,
    },
    featureItem: {
        marginBottom: 10,
    },
    featureTitle: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
    featureContent: {
        fontSize: 16,
        color: '#000',
        marginLeft: 10,
    },
    outcomeItem: {
        marginBottom: 10,
    },
    outcomeTitle: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
    outcomeContent: {
        fontSize: 16,
        color: '#000',
        marginLeft: 10,
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