import React, { useState, useContext } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BaseUrlContext } from '../../BaseUrlContext'; // Import the BaseUrlContext

const SearchUsers = () => {
    const baseUrl = useContext(BaseUrlContext); // Access the baseUrl from context
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (text) => {
        setQuery(text);
        if (text) {
            try {
                const response = await fetch(`${baseUrl}/search?query=${text}`);
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        } else {
            setResults([]);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search users..."
                value={query}
                onChangeText={handleSearch}
            />
            <FlatList
                data={results}
                keyExtractor={(item) => item.UserId}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.resultItem}>
                        <Text style={styles.resultText}>{item.UserName} ({item.Name})</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E0F2FE',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    resultText: {
        fontSize: 16,
    },
});

export default SearchUsers;