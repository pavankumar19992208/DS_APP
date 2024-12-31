import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserDataContext, BaseUrlContext } from '../../BaseUrlContext'; // Import BaseUrlContext
import Loader from '../commons/Loader';
import SkeletonLoader from '../commons/SkeletonLoader';

const { width, height } = Dimensions.get('window');

const Profile = ({ route }) => {
    const { profileId } = route.params;
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [showAllPosts, setShowAllPosts] = useState(false);
   // const [showAllPosts, setShowAllPosts] = useState(false);
    const baseUrl = useContext(BaseUrlContext); // Access baseUrl from BaseUrlContext
    const userData = useContext(UserDataContext); // Access userData from UserDataContext

    // useEffect(() => {
    //     fetchProfile();
    // }, []);
    useEffect(() => {
        if (profileId) {
            fetchProfile();
        } else {
            console.error('Profile ID is missing');
            Alert.alert('Error', 'Profile ID is missing');
        }
    }, [profileId]);

    const fetchProfile = async () => {
        setLoading(true);
        console.log("profileId: ", profileId);
        console.log("userData: ", userData);
        try { 
            const response = await fetch(`${baseUrl}/profiledata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserId: profileId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }

            const data = await response.json();
            console.log(data);
            setProfile(data);
            if (data.posts) {
                fetchPosts(data.posts);
            } else {
                setPosts(null);
            }
        } catch (error) {
            console.error('error fetching profile:', error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchPosts = async (postIds) => {
        setLoadingPosts(true);
        const payload = { post_ids: Array.isArray(postIds) ? postIds : JSON.parse(postIds) };
        console.log('Fetching posts with payload:', payload); // Print the payload to the console
        console.log('baseUrl:', baseUrl);
        try {
            const response = await fetch(`${baseUrl}/fetchposts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            setPosts(data);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoadingPosts(false);
        }
    };

    const handleFriendRequest = async () => {
        const payload = { UserId: userData.userData.UserId, FriendId: profile.UserId };
        console.log('Friend request payload:', payload); // Print the payload to the console

        try {
            const response = await fetch(`${baseUrl}/friendrequests`, {
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
            Alert.alert('Success', 'Friend request sent');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleUnfriend = () => {
        // Implement unfriend logic here
        Alert.alert('Unfriended');
    };

    const renderPost = ({ item }) => {
        const mediaUrls = item.MediaUrl ? JSON.parse(item.MediaUrl) : [];
        return (
            <View style={styles.postContainer}>
                {/* Row 1 */}
                <View style={styles.postRow1}>
                    <View style={styles.postColumn1}>
                        <Image
                            source={profile.Photo ? { uri: profile.Photo } : require('../../assets/images/studentm.png')}
                            style={styles.postProfilePic}
                        />
                    </View>
                    <View style={styles.postColumn2}>
                        <Text style={styles.postStudentName}>{profile.Name ?? ''}</Text>
                        <Text style={styles.postSchoolName}>{userData.userData.SCHOOL_NAME ?? ''}</Text>
                    </View>
                    <View style={styles.postColumn3}>
                        <TouchableOpacity>
                            <Icon name="more-vert" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Post Content */}
                <View style={styles.postContentContainer}>
                    <Text style={styles.postContent}>{item.PostContent ?? ''}</Text>
                </View>
                {/* Row 2 */}
                <View style={styles.postRow2}>
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
                <View style={styles.postRow3}>
                    <View style={styles.postColumn1}>
                        <TouchableOpacity style={{ marginRight: 20}}>
                            <Icon name="favorite-border" size={24} color="#E31C62" />
                        </TouchableOpacity>
                        <Text style={{ marginRight: 20}}>{item.likesCount ?? 0}</Text>
                    </View>
                    <View style={styles.postColumn2}>
                        <TouchableOpacity>
                            <Icon name="chat-bubble-outline" size={24} color="#E31C62" />
                        </TouchableOpacity>
                        <Text>{item.commentsCount ?? 0}</Text>
                    </View>
                    <View style={styles.postcolumn3}>
                        <TouchableOpacity>
                            <Icon name="bookmark-outline" size={24} color="#E31C62" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.postColumn4}>
                        <TouchableOpacity style={{ marginLeft: 10}}>
                            <Icon name="share" size={24} color="#E31C62" />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Row 4 */}
                <View style={styles.postRow4}>
                    <View style={styles.postColumnu}>
                        <Text>{new Date(item.TimeStamp).toLocaleString()}</Text>
                    </View>
                    <View style={styles.postColumnu}>
                        <Text>{item.Location ?? ''}</Text>
                    </View>
                </View>
            </View>
        );
    };

    if (!profile) {
        return  <Loader visible={loading} /> 
    }

    const isFriend = userData.userData.friends_list?.includes(profileId);

    return (
        <View style={styles.container}>
            {/* Row 1 */}
           {/* // <Loader visible={loading} />  */}
            <View style={styles.row1}>
                <View style={styles.column1}>
                    <Image
                        source={profile.Photo ? { uri: profile.Photo } : require('../../assets/images/studentm.png')}
                        style={styles.profilePic}
                    />
                    <Text style={styles.username}>{profile.UserName ?? ''}</Text>
                </View>
                <View style={styles.column2}>
                    <Text style={styles.studentName}>{profile.Name ?? ''}</Text>
                    <Text style={styles.schoolName}>{profile.SCHOOL_NAME ?? ''}</Text>
                </View>
            </View>
            {/* New Row for Buttons */}
            
                console.log("userData.UserId: ", userData.userData.UserId),
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Friends: {profile.friends_count ?? 0}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Posts: {profile.posts_count ?? 0}</Text>
                    </TouchableOpacity>
                    {userData.userData.UserId !== profileId && (
                        <>
                    {isFriend ? (
                        <TouchableOpacity style={styles.button} onPress={handleUnfriend}>
                            <Text style={styles.buttonText}>Unfriend</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={handleFriendRequest}>
                            <Text style={styles.buttonText}>Send Friend Request</Text>
                        </TouchableOpacity>
                        
                    )}
                    </>
                    )}
                </View>
        
            {/* Row 2 */}
            <View style={styles.row2}>
                <Text style={styles.postsTitle}>Posts</Text>
                {loadingPosts ? (
                    <FlatList
                        data={[...Array(5).keys()]} // Create an array with 5 elements for the skeleton loader
                        renderItem={() => <SkeletonLoader />}
                        keyExtractor={(item) => item.toString()}
                    />
                ) : posts === null ? (
                    <Text>You don't have any uploaded posts yet</Text>
                ) : (
                    <FlatList
                        data={showAllPosts ? posts : posts.slice(0, 2)}
                        renderItem={renderPost}
                        keyExtractor={(item) => item.PostId?.toString() ?? Math.random().toString()}
                        onEndReached={() => setShowAllPosts(true)}
                        onEndReachedThreshold={0.5}
                    />
                )}
                {!showAllPosts && posts !== null && (
                    <TouchableOpacity onPress={() => setShowAllPosts(true)} style={styles.morePostsButton}>
                        <Text style={styles.morePostsText}>More posts</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#E0F2FE',
    },
    row1: {
        height: height * 0.12, // 30% of screen height
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    column1: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    column2: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 5,
    },
    username: {
        fontSize: 14,
        fontWeight: '600',
    },
    studentName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    schoolName: {
        fontSize: 16,
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    button: {
        padding: 10,
        backgroundColor: '#0E5E9D',
        borderRadius: 5,
        marginBottom: 5,
    },
    buttonText: {
        fontSize: 14,
        color: '#fff',
    },
    row2: {
        flex: 1,
    },
    postsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
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
        width: width - 20,
        alignSelf: 'center',
    },
    postRow1: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    postColumn1: {
        width: '15%',
        alignItems: 'center',
    },
    postColumn2: {
        width: '70%',
        justifyContent: 'center',
    },
    postColumn3: {
        width: '15%',
        alignItems: 'flex-end',
    },
    postProfilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    postStudentName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    postSchoolName: {
        fontSize: 14,
    },
    postContentContainer: {
        marginBottom: 10,
    },
    postContent: {
        fontSize: 14,
    },
    media: {
        width: width - 40,
        height: height * 0.4,
        borderRadius: 5,
    },
    postRow2: {
        height: 200,
        marginBottom: 10,
    },
    postRow3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    postRow4: {
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

export default Profile;