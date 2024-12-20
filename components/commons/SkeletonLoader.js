import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';

const { width } = Dimensions.get('window');

const SkeletonLoader = () => {
    return (
        <View style={styles.container}>
            <ContentLoader
                speed={2}
                width={width - 20}
                height={200}
                viewBox={`0 0 ${width - 20} 200`}
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
            >
                <Rect x="0" y="0" rx="5" ry="5" width="40" height="40" />
                <Rect x="50" y="0" rx="5" ry="5" width="200" height="20" />
                <Rect x="50" y="30" rx="5" ry="5" width="150" height="15" />
                <Rect x="0" y="60" rx="5" ry="5" width="100%" height="100" />
                <Rect x="0" y="170" rx="5" ry="5" width="80" height="20" />
                <Rect x="90" y="170" rx="5" ry="5" width="80" height="20" />
                <Rect x="180" y="170" rx="5" ry="5" width="80" height="20" />
            </ContentLoader>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
});

export default SkeletonLoader;