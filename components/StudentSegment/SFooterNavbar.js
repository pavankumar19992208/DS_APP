import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SFooterNavbar = ({ navigation }) => {
	return (
		<View style={styles.footer}>
			<TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('')}>
				<Icon name="home" size={30} color="#FFF" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Assessments')}>
				<Icon name="fact-check" size={30} color="#FFF" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('BotGenie')}>
				<Image source={require('../../assets/images/genie_icon.png')} style={styles.genieLogo} />
			</TouchableOpacity>
			<TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Planner')}>
				<Icon name="event" size={30} color="#FFF" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Learn')}>
				<Icon name="school" size={30} color="#FFF" />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	footer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 60,
		backgroundColor: '#E31C62D0',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	iconContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	genieLogo: {
		width: 60,
		height: 80,
		marginBottom: 20,
	},
});

export default SFooterNavbar;