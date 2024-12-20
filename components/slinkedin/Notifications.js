import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { UserDataContext, BaseUrlContext } from '../../BaseUrlContext'; // Import BaseUrlContext
import SLinkedInNavbar from './SLinkedInNavbar'; // Import the SLinkedInNavbar component

const { width, height } = Dimensions.get('window');

const Notifications = ({ navigation }) => {
    const baseUrl = useContext(BaseUrlContext); // Access baseUrl from BaseUrlContext
    const { userData } = useContext(UserDataContext); // Access userData from UserDataContext
    const [activeTab, setActiveTab] = useState('notifications');
    const [notifications, setNotifications] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        if (activeTab === 'notifications') {
            fetchNotifications();
        } else {
            fetchFriendRequests();
        }
    }, [activeTab]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${baseUrl}/fetchnotifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserId: userData.UserId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchFriendRequests = async () => {
        try {
            const response = await fetch(`${baseUrl}/fetchfriendrequests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserId: userData.UserId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const filteredRequests = data.filter(request => !userData.friends_list.includes(request.UserId));
            setFriendRequests(filteredRequests);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    const handleAccept = async (friendId) => {
        try {
            const response = await fetch(`${baseUrl}/addfriend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserId: userData.UserId, FriendId: friendId }),
            });

            if (response.ok) {
                setFriendRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request.UserId === friendId ? { ...request, status: 'Accepted' } : request
                    )
                );
            } else {
                throw new Error('Failed to accept friend request');
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleReject = async (friendId) => {
        try {
            const response = await fetch(`${baseUrl}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserId: userData.UserId, FriendId: friendId }),
            });

            if (response.ok) {
                setFriendRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request.UserId === friendId ? { ...request, status: 'Rejected' } : request
                    )
                );
            } else {
                throw new Error('Failed to reject friend request');
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    const renderNotification = ({ item }) => (
        <TouchableOpacity style={styles.notificationItem} onPress={() => navigation.navigate(item.redirect)}>
            <Text style={styles.notificationText}>{item.message}</Text>
        </TouchableOpacity>
    );

    const renderFriendRequest = ({ item }) => (
        <View style={styles.friendRequestItem}>
            <Image
                source={item.Photo ? { uri: item.Photo } : require('../../assets/images/studentm.png')}
                style={styles.profilePic}
            />
            <Text style={styles.friendRequestText}>{item.Name}</Text>
            {item.status === 'Accepted' ? (
                <TouchableOpacity style={[styles.acceptButton, styles.disabledButton]} disabled>
                    <Text style={styles.buttonText}>Accepted</Text>
                </TouchableOpacity>
            ) : item.status === 'Rejected' ? (
                <TouchableOpacity style={[styles.rejectButton, styles.disabledButton]} disabled>
                    <Text style={styles.buttonText}>Rejected</Text>
                </TouchableOpacity>
            ) : (
                <>
                    <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item.UserId)}>
                        <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.UserId)}>
                        <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );

    return (
        <>
            <View style={styles.container}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
                        onPress={() => setActiveTab('notifications')}
                    >
                        <Text style={styles.tabText}>Notifications</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'friendRequests' && styles.activeTab]}
                        onPress={() => setActiveTab('friendRequests')}
                    >
                        <Text style={styles.tabText}>Friend Requests</Text>
                    </TouchableOpacity>
                </View>
                {activeTab === 'notifications' ? (
                    notifications.length > 0 ? (
                        <FlatList
                            data={notifications}
                            renderItem={renderNotification}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <Text style={styles.noDataText}>No notifications to show</Text>
                    )
                ) : (
                    friendRequests.length > 0 ? (
                        <FlatList
                            data={friendRequests}
                            renderItem={renderFriendRequest}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <Text style={styles.noDataText}>No friend requests to show</Text>
                    )
                )}
            </View>
            <SLinkedInNavbar navigation={navigation} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F2FE',
        paddingBottom: height * 0.08, // Adjust padding to accommodate the navbar
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    tab: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    activeTab: {
        backgroundColor: '#0E5E9D',
    },
    tabText: {
        color: '#000',
    },
    notificationItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    notificationText: {
        fontSize: 16,
    },
    friendRequestItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    friendRequestText: {
        fontSize: 16,
        flex: 1,
    },
    acceptButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    rejectButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
    },
    disabledButton: {
        opacity: 0.6,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});

export default Notifications;