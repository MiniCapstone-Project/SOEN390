import { StyleSheet, Platform, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const MarkerInfoBoxStyles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    container: {
        width: '90%',
        maxHeight: height * 0.7,
        backgroundColor: 'white',
        borderRadius: 12,
        elevation: Platform.OS === 'android' ? 5 : 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    scrollView: {
        maxHeight: height * 0.65,
    },
    coordinateContainer: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 5,
        color: '#555',
    },
    coordinateText: {
        fontSize: 14,
        color: '#666',
        marginVertical: 2,
    },
    divider: {
        marginVertical: 12,
        height: 1,
        backgroundColor: '#eee',
    },
    propertyRow: {
        flexDirection: 'row',
        marginVertical: 3,
        flexWrap: 'wrap',
    },
    propertyKey: {
        fontSize: 14,
        fontWeight: '500',
        color: '#444',
        marginRight: 5,
        width: '40%',
    },
    propertyValue: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
}); 