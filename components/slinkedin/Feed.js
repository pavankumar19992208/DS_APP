import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, Alert, Modal, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; // Import Ionicons
import { UserDataContext, BaseUrlContext } from '../../BaseUrlContext'; // Import UserDataContext and BaseUrlContext
import SkeletonLoader from '../commons/SkeletonLoader';

const { width, height } = Dimensions.get('window');

const Feed = ({ navigation }) => {
    const { userData } = useContext(UserDataContext); // Access userData from UserDataContext
    const baseUrl = useContext(BaseUrlContext); // Access baseUrl from BaseUrlContext
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(''); // State for message
    const [selectedPost, setSelectedPost] = useState(null); // State for selected post
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const postIds = Array.isArray(userData.feed) ? userData.feed : JSON.parse(userData.feed);

        if (!postIds || postIds.length === 0) {
            setMessage('Post or make connections to get the feed');
            setLoading(false);
            return;
        }

        const payload = { post_ids: postIds };
        console.log('Fetching posts with payload:', payload); // Print the payload to the console

        try {
            const response = await fetch(`${baseUrl}/fetchposts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            setPosts(data);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`${baseUrl}/fetchcomments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId }),
            });

            if (!response.ok) {
                // throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            Alert.alert('Error', error.message);
            return [];
        }
    };

    const handlePostPress = async (post) => {
        const comments = await fetchComments(post.PostId);
        setSelectedPost({ ...post, comments });
        setModalVisible(true);
    };

    const renderPost = ({ item }) => {
        const mediaUrls = JSON.parse(item.MediaUrl);
        const isStudent = item.UserId.startsWith('S');
        return (
            <View style={styles.postContainer}>
                {/* Row 1 */}
                <View style={styles.row1}>
                    <View style={styles.column1}>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile', { profileId: item.UserId })}>
                            <Image
                                source={userData.user?.Photo ? { uri: userData.user.Photo } : require('../../assets/images/studentm.png')}
                                style={styles.profilePic}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.column2}>
                        <View style={styles.usernameContainer}>
                            <Text style={styles.studentName}>
                                {userData.user?.Name ?? ''}{' '}
                            </Text>
                            {!isStudent && <View style={styles.blueDot} />}
                        </View>
                        <Text style={styles.schoolName}>{userData.user?.SCHOOL_NAME ?? ''}</Text>
                    </View>
                    <View style={styles.column3}>
                        <TouchableOpacity>
                            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.postContentContainer}>
                    <Text
                        style={styles.postContent}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item.PostContent}
                    </Text>
                    <TouchableOpacity onPress={() => handlePostPress(item)}>
                        <Text style={styles.moreText}>...more</Text>
                    </TouchableOpacity>
                </View>
                {/* Row 2 */}
                <View style={styles.row2}>
                    <TouchableOpacity onPress={() => handlePostPress(item)}>
                        <FlatList
                            data={mediaUrls}
                            horizontal
                            pagingEnabled
                            renderItem={({ item }) => (
                                <Image source={{ uri: item }} style={styles.media} />
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </TouchableOpacity>
                </View>
                {/* Row 3 */}
                <View style={styles.row3}>
                    <View style={styles.column1}>
                        <TouchableOpacity style={{ marginRight: 20 }}>
                            <Ionicons name="heart-outline" size={24} color="#E31C62" />
                        </TouchableOpacity>
                        <Text style={{ marginRight: 20 }}>{item.likesCount ?? 0}</Text>
                    </View>
                    <View style={styles.column2}>
                        <TouchableOpacity>
                            <Ionicons name="chatbubble-outline" size={24} color="#E31C62" />
                        </TouchableOpacity>
                        <Text>{item.commentsCount ?? 0}</Text>
                    </View>
                    <View style={styles.column3}>
                        <TouchableOpacity>
                            <Ionicons name="bookmark-outline" size={24} color="#E31C62" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.column4}>
                        <TouchableOpacity style={{ marginLeft: 10 }}>
                            <Ionicons name="share-social-outline" size={24} color="#E31C62" />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Row 4 */}
                <View style={styles.row4}>
                    <View style={styles.columni}>
                        <Text>{new Date(item.TimeStamp).toLocaleString()}</Text>
                    </View>
                    <View style={styles.columni}>
                        <Text>{item.Location ?? ''}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <FlatList
                    data={[...Array(5).keys()]} // Create an array with 5 elements for the skeleton loader
                    renderItem={() => <SkeletonLoader />}
                    keyExtractor={(item) => item.toString()}
                    showsVerticalScrollIndicator={false} // Hide vertical scroll bar
                />
            ) : message ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>{message}</Text>
                </View>
            ) : (
                <FlatList
                    data={posts}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.PostId.toString()}
                    ListFooterComponent={loading && <Text>Loading...</Text>}
                    showsVerticalScrollIndicator={false} // Hide vertical scroll bar
                />
            )}

            {/* Modal for Fullscreen Post */}
            {selectedPost && (
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <ScrollView style={styles.modalContainer}>
                        <View style={styles.row1}>
                            <View style={styles.column1}>
                                <TouchableOpacity onPress={() => navigation.navigate('Profile', { profileId: selectedPost.UserId })}>
                                    <Image
                                        source={userData.user?.Photo ? { uri: userData.user.Photo } : require('../../assets/images/studentm.png')}
                                        style={styles.profilePic}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.column2}>
                                <View style={styles.usernameContainer}>
                                    <Text style={styles.studentName}>
                                        {userData.user?.Name ?? ''}{' '}
                                    </Text>
                                    {selectedPost.UserId.startsWith('T') && <View style={styles.blueDot} />}
                                </View>
                                <Text style={styles.schoolName}>{userData.user?.SCHOOL_NAME ?? ''}</Text>
                            </View>
                            <View style={styles.column3}>
                                <TouchableOpacity>
                                    <Ionicons name="ellipsis-vertical" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.postContainer1}>
                            <View style={styles.postContentContainer1}>
                                <Text style={styles.fullPostContent}>{selectedPost.PostContent}</Text>
                            </View>
                            {/* Row 2 */}
                            <View style={styles.erow2}>
                                <FlatList
                                    data={JSON.parse(selectedPost.MediaUrl)}
                                    horizontal
                                    pagingEnabled
                                    renderItem={({ item }) => (
                                        <Image source={{ uri: item }} style={styles.media1} />
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                            {/* Row 3 */}
                            <View style={styles.row3}>
                                <View style={styles.column1}>
                                    <TouchableOpacity style={{ marginRight: 20 }}>
                                        <Ionicons name="heart-outline" size={24} color="#E31C62" />
                                    </TouchableOpacity>
                                    <Text style={{ marginRight: 20 }}>{selectedPost.likesCount ?? 0}</Text>
                                </View>
                                <View style={styles.column2}>
                                    <TouchableOpacity>
                                        <Ionicons name="chatbubble-outline" size={24} color="#E31C62" />
                                    </TouchableOpacity>
                                    <Text>{selectedPost.commentsCount ?? 0}</Text>
                                </View>
                                <View style={styles.column3}>
                                    <TouchableOpacity>
                                        <Ionicons name="bookmark-outline" size={24} color="#E31C62" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.column4}>
                                    <TouchableOpacity style={{ marginLeft: 10 }}>
                                        <Ionicons name="share-social-outline" size={24} color="#E31C62" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* Row 4 */}
                            <View style={styles.row4}>
                                <View style={styles.columni}>
                                    <Text>{new Date(selectedPost.TimeStamp).toLocaleString()}</Text>
                                </View>
                                <View style={styles.columni}>
                                    <Text>{selectedPost.Location ?? ''}</Text>
                                </View>
                            </View>
                        </View>
                        <FlatList
                            data={selectedPost.comments}
                            renderItem={({ item }) => (
                                <View style={styles.commentContainer}>
                                    <Text style={styles.commentText}>{item.CommentContent}</Text>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={<Text>No comments to show</Text>}
                        />
                    </ScrollView>
                    <View style={styles.extra}></View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    extra: { marginBottom: 20 },
    postContainer: {
        backgroundColor: '#fff',
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        width: width - 20, // Ensure the width does not exceed the device width
        alignSelf: 'center', // Center the post container
    },
    row1: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    column1: {
        width: '15%',
        alignItems: 'center',
    },
    column2: {
        flex: 1,
        justifyContent: 'center',
    },
    column3: {
        width: '15%',
        alignItems: 'flex-end',
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    studentName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    schoolName: {
        fontSize: 14,
    },
    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    blueDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0E5E9D',
        marginLeft: 5,
        alignSelf: 'center',
    },
    postContentContainer: {
        marginBottom: 10,
    },
    postContentContainer1: {
        marginBottom: 10,
        padding: 10,
    },
    postContent: {
        fontSize: 14,
    },
    moreText: {
        color: '#0E5E9D',
        marginTop: 5,
    },
    row2: {
        height: height * 0.4,
        marginBottom: 10,
    },
    erow2: {
        width: width - 10,
        height: height * 0.5,
        alignItems: 'center',
        marginBottom: 10,
    },
    media: {
        width: width - 40,
        height: height * 0.4,
        borderRadius: 5,
    },
    media1: {
        width: width - 10,
        height: height * 0.5,
        borderRadius: 5,
    },
    row3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    row4: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    morePostsButton: {
        alignSelf: 'flex-end',
        marginTop: 10,
    },
    morePostsText: {
        fontSize: 14,
        color: '#0E5E9D',
    },
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageText: {
        fontSize: 16,
        color: '#0E5E9D',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    fullPostContent: {
        fontSize: 16,
        marginBottom: 20,
    },
    commentContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    commentText: {
        fontSize: 14,
    },
});

export default Feed;