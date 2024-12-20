import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Dimensions, Image, Alert, Modal, ActivityIndicator } from 'react-native';
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
    const [fetchError, setFetchError] = useState(false);
    const [sending, setSending] = useState(false);
    const ws = useRef(null);

    useEffect(() => {
        fetchMessages();
        setupWebSocket();
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
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
            if (data.length === 0) {
                setFetchError(true);
            } else {
                setMessages(data);
                setFetchError(false);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setFetchError(true);
        }
    };

    const setupWebSocket = () => {
        console.log("chatId", chatId);
        ws.current = new WebSocket(`${baseUrl.replace(/^http/, 'ws')}/ws/chat/${chatId}`);

        ws.current.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.current.onmessage = (event) => {
            console.log('Raw WebSocket message:', event.data);
            try {
                // Strip the prefix before parsing the JSON
                const jsonStartIndex = event.data.indexOf('{');
                const jsonString = event.data.substring(jsonStartIndex);
                const newMessage = JSON.parse(jsonString);
                setMessages((prevMessages) => {
                    // Check if the message already exists
                    if (!prevMessages.some(msg => msg.id === newMessage.id)) {
                        return [...prevMessages, newMessage];
                    }
                    return prevMessages;
                });
                setFetchError(false); // Hide the "Send your first message" message
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };
    };

    const handleSendMessage = async () => {
        if (message.trim() || attachments.length > 0) {
            setSending(true);
            try {
                const uploadedUrls = await uploadAttachments();

                const newMessage = {
                    ChatId: chatId,
                    SenderId: userData.UserId,
                    Content: message,
                    MessageType: 'text',
                    MediaUrl: uploadedUrls,
                    sending: true,
                };

                // Send the message to the WebSocket server
                ws.current.send(JSON.stringify(newMessage));

                // Update the messages state to include the new message with sending status
                setMessages((prevMessages) => [...prevMessages, newMessage]);

                // Store the message in the database
                await fetch(`${baseUrl}/addmessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newMessage),
                });

                // Update the messages state to mark the message as sent
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg === newMessage ? { ...msg, sending: false } : msg
                    )
                );

                setFetchError(false); // Hide the "Send your first message" message

                setMessage('');
                setAttachments([]);
                setModalVisible(false);
                setSelectedFile(null);
                setCaption('');
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setSending(false);
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

    const renderItem = ({ item }) => {
        const isUserMessage = item.SenderId === userData.UserId;
        return (
            <View style={[styles.messageContainer, isUserMessage ? styles.userMessage : styles.friendMessage]}>
                {isUserMessage ? (
                    <>
                        <Text style={[styles.messageText, styles.userMessageText]}>{item.Content}</Text>
                        {item.sending ? (
                            <ActivityIndicator size="small" color="gray" style={styles.loader} />
                        ) : (
                            <Icon name="check" size={20} color="gray" style={styles.checkIcon} />
                        )}
                    </>
                ) : (
                    <>
                        {item.sending ? (
                            <ActivityIndicator size="small" color="gray" style={styles.loader} />
                        ) : (
                            <Icon name="check" size={20} color="gray" style={styles.checkIcon} />
                        )}
                        <Text style={styles.messageText}>{item.Content}</Text>
                    </>
                )}
            </View>
        );
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
            {fetchError ? (
                <View style={styles.centeredView}>
                    <Text style={styles.centeredText}>Send your first message to start communication</Text>
                </View>
            ) : (
                <FlatList
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.messagesList}
                />
            )}

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
        width: 'auto',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
        maxWidth: '80%',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
    },
    userMessage: {
        width: 'auto',
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    friendMessage: {
        width: 'auto',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
    },
    messageText: {
        fontSize: 16,
        flex: 1,
        marginRight: 4,
    },
    userMessageText: {
        textAlign: 'right',
        marginRight: 4,
    },
    loader: {
        marginRight: 4,
    },
    checkIcon: {
        marginRight: 4,
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredText: {
        fontSize: 16,
        color: 'gray',
    },
});

export default ChatScreen;