import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, Surface, Divider } from 'react-native-paper';
import { MarkerInfoBoxStyles } from '@/Styles/MarkerInfoBoxStyle';

interface MarkerInfoBoxProps {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    title?: string;
    properties?: any;
    onClose: () => void;
    onDirections: () => void;
}

export const MarkerInfoBox: React.FC<MarkerInfoBoxProps> = ({
    coordinate,
    title,
    properties,
    onClose,
    onDirections,
}) => {
    const displayProperties = properties || {};

    const { coordinate: _, ...displayProps } = displayProperties;

    return (
        <View style={MarkerInfoBoxStyles.overlay}>
            <Surface style={MarkerInfoBoxStyles.container}>
                <ScrollView style={MarkerInfoBoxStyles.scrollView}>
                    <View style={MarkerInfoBoxStyles.coordinateContainer}>
                        <Text style={MarkerInfoBoxStyles.title}>
                            {title || 'Selected Location'}
                        </Text>

                        <>
                            <Divider style={MarkerInfoBoxStyles.divider} />
                            <Text style={MarkerInfoBoxStyles.sectionTitle}>Building Details</Text>
                            
                    
                            
                            {properties?.Building_Long_Name && (
                                <View style={MarkerInfoBoxStyles.propertyRow}>
                                    <Text style={MarkerInfoBoxStyles.propertyKey}>Building Full Name:</Text>
                                    <Text style={MarkerInfoBoxStyles.propertyValue}>{properties.Building_Long_Name}</Text>
                                </View>
                            )}
                            
                            {properties?.Address && (
                                <View style={MarkerInfoBoxStyles.propertyRow}>
                                    <Text style={MarkerInfoBoxStyles.propertyKey}>Address:</Text>
                                    <Text style={MarkerInfoBoxStyles.propertyValue}>{properties.Address}</Text>
                                </View>
                            )}
                            
                            {properties?.Building && (
                                <View style={MarkerInfoBoxStyles.propertyRow}>
                                    <Text style={MarkerInfoBoxStyles.propertyKey}>Building Code:</Text>
                                    <Text style={MarkerInfoBoxStyles.propertyValue}>{properties.Building}</Text>
                                </View>
                            )}
                            
                            {properties?.Campus && (
                                <View style={MarkerInfoBoxStyles.propertyRow}>
                                    <Text style={MarkerInfoBoxStyles.propertyKey}>Campus:</Text>
                                    <Text style={MarkerInfoBoxStyles.propertyValue}>{properties.Campus}</Text>
                                </View>
                            )}
                            
                            {coordinate && (
                                <>
                                    <Divider style={MarkerInfoBoxStyles.divider} />
                                    <Text style={MarkerInfoBoxStyles.sectionTitle}>Coordinates</Text>
                                    <View style={MarkerInfoBoxStyles.propertyRow}>
                                        <Text style={MarkerInfoBoxStyles.propertyKey}>Latitude:</Text>
                                        <Text style={MarkerInfoBoxStyles.propertyValue}>{coordinate.latitude.toFixed(6)}</Text>
                                    </View>
                                    <View style={MarkerInfoBoxStyles.propertyRow}>
                                        <Text style={MarkerInfoBoxStyles.propertyKey}>Longitude:</Text>
                                        <Text style={MarkerInfoBoxStyles.propertyValue}>{coordinate.longitude.toFixed(6)}</Text>
                                    </View>
                                </>
                            )}
                        </>

                        <View style={{ 
                            flexDirection: 'row', 
                            justifyContent: 'space-between',
                            marginTop: 20
                        }}>
                            <Button 
                                mode="contained" 
                                onPress={onClose}
                                style={{ flex: 1, marginRight: 10 }}
                            >
                                Close
                            </Button>
                            <Button 
                                mode="contained" 
                                onPress={onDirections}
                                style={{ flex: 1 }}
                            >
                                Directions 
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </Surface>
        </View>
    );
};