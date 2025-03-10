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
                            <Text style={MarkerInfoBoxStyles.sectionTitle}>
                                {properties?.poi_type ? 'Place Details' : 'Building Details'}
                            </Text>
                            
                    
                            
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
                            
                            {/* Display POI-specific information */}
                            {properties?.poi_type && (
                                <View style={MarkerInfoBoxStyles.propertyRow}>
                                    <Text style={MarkerInfoBoxStyles.propertyKey}>Type:</Text>
                                    <Text style={MarkerInfoBoxStyles.propertyValue}>{properties.poi_type}</Text>
                                </View>
                            )}
                            
                            {properties?.rating > 0 && (
                                <View style={MarkerInfoBoxStyles.propertyRow}>
                                    <Text style={MarkerInfoBoxStyles.propertyKey}>Rating:</Text>
                                    <Text style={MarkerInfoBoxStyles.propertyValue}>{properties.rating} ★</Text>
                                </View>
                            )}
                            
                            {properties?.price_level > 0 && (
                                <View style={MarkerInfoBoxStyles.propertyRow}>
                                    <Text style={MarkerInfoBoxStyles.propertyKey}>Price Level:</Text>
                                    <Text style={MarkerInfoBoxStyles.propertyValue}>{Array(properties.price_level).fill('$').join('')}</Text>
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