import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserDataContext, BaseUrlContext } from '../../BaseUrlContext'; // Import UserDataContext and BaseUrlContext

const { width, height } = Dimensions.get('window');

const Feed = ({ navigation }) => {
    const { userData } = useContext(UserDataContext); // Access userData from UserDataContext
    const baseUrl = useContext(BaseUrlContext); // Access baseUrl from BaseUrlContext
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const postIds = Array.isArray(userData.posts) ? userData.posts : JSON.parse(userData.posts);
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

    const renderPost = ({ item }) => {
        console.log("UserId: ", item.UserId);
        const mediaUrls = JSON.parse(item.MediaUrl);
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
                        <Text style={styles.studentName}>{userData.user?.Name ?? ''}</Text>
                        <Text style={styles.schoolName}>{userData.user?.SCHOOL_NAME ?? ''}</Text>
                    </View>
                    <View style={styles.column3}>
                        <TouchableOpacity>
                            <Icon name="more-vert" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.postContentContainer}>
                    <Text style={styles.postContent}>{item.PostContent}</Text>
                </View>
                {/* Row 2 */}
                <View style={styles.row2}>
                    <FlatList
                        data={mediaUrls}
                        horizontal
                        pagingEnabled
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={styles.media} />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                {/* Row 3 */}
                <View style={styles.row3}>
                    <View style={styles.column1}>
                        <TouchableOpacity>
                            <Icon name="favorite-border" size={24} color="#E31C62" />
                        </TouchableOpacity>
                        <Text>{item.likesCount ?? 0}</Text>
                    </View>
                    <View style={styles.column2}>
                        <TouchableOpacity>
                            <Icon name="chat-bubble-outline" size={24} color="#E31C62" />
                        </TouchableOpacity>
                        <Text>{item.commentsCount ?? 0}</Text>
                    </View>
                    <View style={styles.column3}>
                        <TouchableOpacity>
                            <Icon name="share" size={24} color="#E31C62" />
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
        <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.PostId.toString()}
            ListFooterComponent={loading && <Text>Loading...</Text>}
        />
    );
};

const styles = StyleSheet.create({
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
    postContentContainer: {
        marginBottom: 10,
    },
    postContent: {
        fontSize: 14,
    },
    row2: {
        height: 200,
        marginBottom: 10,
    },
    media: {
        width: width - 40,
        height: '100%',
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
});

export default Feed;