import React from 'react';
import { View, Text, Modal, StyleSheet, Button } from 'react-native';

const ReportCardModal = ({ visible, onClose, data, exam, studentName, sgrade, section }) => {
    if (!data) return null;
    const allSubjects = ['ENGLISH', 'TELUGU', 'HINDI', 'MATHS', 'SCIENCE', 'SOCIAL'];
    const subjects = allSubjects.map(subject => ({
        name: subject,
        marks: data[subject] || '-'
    }));

    const allSubjectsHaveMarks = subjects.every(subject => subject.marks !== '-');

    let cumulativePercentage = '-';
    let status = '-';
    let statusColor = 'black';
    let grade = '-';

    if (allSubjectsHaveMarks) {
        const totalMarks = subjects.reduce((sum, subject) => {
            return sum + parseInt(subject.marks, 10);
        }, 0);

        const maxMarks = exam.startsWith('FA') ? 20 : 100;
        cumulativePercentage = (totalMarks / (maxMarks * subjects.length)) * 100;

        status = 'PASS';
        statusColor = 'green';

        subjects.forEach(subject => {
            const mark = parseInt(subject.marks, 10);
            if (exam.startsWith('FA') && mark < 8) {
                status = 'FAIL';
                statusColor = 'red';
            } else if (exam.startsWith('SA') && mark < 35) {
                status = 'FAIL';
                statusColor = 'red';
            }
        });

        if (cumulativePercentage >= 91) {
            grade = 'A+';
        } else if (cumulativePercentage >= 81) {
            grade = 'A';
        } else if (cumulativePercentage >= 71) {
            grade = 'B+';
        } else if (cumulativePercentage >= 61) {
            grade = 'B';
        } else if (cumulativePercentage >= 51) {
            grade = 'C';
        } else {
            grade = 'D';
        }
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Report Card</Text>
                    <View style={styles.studentInfoContainer}>
                        <Text style={styles.studentName}>{studentName}</Text>
                        <Text style={styles.gradeSection}>{sgrade} {section}</Text>
                    </View>
                    <View style={styles.gridContainer}>
                        {subjects.map((subject, index) => (
                            <View key={index} style={styles.gridRow}>
                                <Text style={styles.gridCell}>{subject.name}</Text>
                                <Text style={[styles.gridCell, { color: (exam.startsWith('FA') && parseInt(subject.marks, 10) < 8) || (exam.startsWith('SA') && parseInt(subject.marks, 10) < 35) ? 'red' : 'black' }]}>{subject.marks}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryText}>Cumulative Percentage: {cumulativePercentage !== '-' ? cumulativePercentage.toFixed(2) : '-'}</Text>
                        <Text style={styles.summaryText}>
                            Status: <Text style={{ color: statusColor }}>{status}</Text>
                        </Text>
                        <Text style={styles.summaryText}>Grade: {grade}</Text>
                    </View>
                    <Button title="Close" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#E0F2FE',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    studentInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    studentName: {
        fontSize: 15,
        fontWeight: '600',
        color:'#E86A88',
        marginLeft:'7%',
    },
    gradeSection: {
        fontSize: 16,
        fontWeight: 'bold',
        color:'#E86A88',
        marginRight:'7%',
    },
    gridContainer: {
        width: '100%',
        marginBottom: 10,
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    gridCell: {
        fontSize: 16,
        width: '50%',
        textAlign: 'center',
    },
    summaryContainer: {
        width: '100%',
        marginBottom: 20,
    },
    summaryText: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default ReportCardModal;