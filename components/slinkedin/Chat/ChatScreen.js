import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Dimensions, Image, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserDataContext, BaseUrlContext } from '../../../BaseUrlContext'; // Import BaseUrlContext
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions
import { storage } from '../../connections/Firebase'; // Import Firebase storage instance

const { width, height } = Dimensions.get('window');

const ChatScreen = ({ route, navigation }) => {
    const { chatId, friendProfile } = route.params;
    const baseUrl = useContext(BaseUrlContext); // Access baseUrl from BaseUrlContext
    const { userData } = useContext(UserDataContext); // Access userData from UserDataContext
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [caption, setCaption] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${baseUrl}/getmessages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ChatId: chatId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() || attachments.length > 0) {
            try {
                const uploadedUrls = await uploadAttachments();

                const response = await fetch(`${baseUrl}/addmessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ChatId: chatId,
                        SenderId: userData.UserId,
                        Content: message,
                        MessageType: 'text',
                        MediaUrl: uploadedUrls,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const newMessage = await response.json();
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setMessage('');
                setAttachments([]);
                setModalVisible(false);
                setSelectedFile(null);
                setCaption('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleAddAttachment = async () => {
        Alert.alert(
            'Select Attachment',
            'Choose the type of attachment you want to add',
            [
                {
                    text: 'Image',
                    onPress: async () => {
                        let result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsMultipleSelection: true,
                        });

                        if (!result.canceled) {
                            setSelectedFile(result.assets[0]);
                            setModalVisible(true);
                        }
                    },
                },
                {
                    text: 'Document',
                    onPress: async () => {
                        let result = await DocumentPicker.getDocumentAsync({
                            type: 'application/pdf',
                            multiple: true,
                        });

                        if (result.type === 'success') {
                            setSelectedFile(result);
                            setModalVisible(true);
                        }
                    },
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    const uploadAttachments = async () => {
        const uploadedUrls = [];
        for (let i = 0; i < attachments.length; i++) {
            const uri = attachments[i];
            const response = await fetch(uri);
            const blob = await response.blob();
            const fileName = `${userData.UserId}_${i}`;
            const storageRef = ref(storage, `Chats/${userData.UserId}/${fileName}`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            uploadedUrls.push(downloadURL);
        }
        return uploadedUrls;
    };

    const handleSendAttachment = async () => {
        if (selectedFile) {
            setAttachments([...attachments, selectedFile.uri]);
            setModalVisible(false);
            setSelectedFile(null);
            setCaption('');
        }
    };

    return (
        <View style={styles.container}>
            {/* Friend Profile Details */}
            {friendProfile && (
                <View style={styles.profileContainer}>
                    <Image
                        source={friendProfile.Photo ? { uri: friendProfile.Photo } : require('../../../assets/images/studentm.png')}
                        style={styles.profilePic}
                    />
                    <Text style={styles.profileName}>{friendProfile.Name}</Text>
                    <Text style={styles.encryptionText}>*This chat is end-to-end encrypted*</Text>
                </View>
            )}
            <View style={styles.separator} />

            {/* Chat Messages */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>{item.Content}</Text>
                    </View>
                )}
                contentContainerStyle={styles.messagesList}
            />

            {/* Message Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity onPress={handleAddAttachment}>
                    <Icon name="attach-file" size={30} color="#0E5E9D" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSendMessage}>
                    <Icon name="send" size={30} color="#0E5E9D" />
                </TouchableOpacity>
            </View>

            {/* Attachment Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        {selectedFile && selectedFile.type === 'image' ? (
                            <Image source={{ uri: selectedFile.uri }} style={styles.selectedImage} />
                        ) : selectedFile ? (
                            <View style={styles.fileContainer}>
                                <Icon name="insert-drive-file" size={100} color="#0E5E9D" />
                                <Text style={styles.fileName}>{selectedFile.name || 'Document'}</Text>
                            </View>
                        ) : null}
                        <TextInput
                            style={styles.captionInput}
                            placeholder="Add a caption..."
                            value={caption}
                            onChangeText={setCaption}
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSendAttachment}>
                            <Text style={styles.sendButtonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F2FE',
    },
    profileContainer: {
        alignItems: 'center',
        padding: 10,
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 5,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    encryptionText: {
        fontSize: 12,
        color: 'gray',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    messagesList: {
        padding: 10,
    },
    messageContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
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
    selectedImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    fileContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    fileName: {
        fontSize: 16,
        marginTop: 10,
    },
    captionInput: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    sendButton: {
        backgroundColor: '#0E5E9D',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ChatScreen;