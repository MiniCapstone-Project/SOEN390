import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, Surface, Divider } from 'react-native-paper';
import { MarkerInfoBoxStyles } from '@/Styles/MarkerInfoBoxStyles';

interface MarkerInfoBoxProps {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    title?: string;
    properties?: any;
    onClose: () => void;
}

const MarkerInfoBox: React.FC<MarkerInfoBoxProps> = ({
    coordinate,
    title,
    properties,
    onClose,
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
                        
                        
                        {Object.keys(displayProps).length > 0 && (
                            <>
                                <Divider style={MarkerInfoBoxStyles.divider} />
                                <Text style={MarkerInfoBoxStyles.sectionTitle}>Properties</Text>
                                
                                {Object.entries(displayProps).map(([key, value]) => (
                                    value && (
                                        <View key={key} style={MarkerInfoBoxStyles.propertyRow}>
                                            <Text style={MarkerInfoBoxStyles.propertyKey}>
                                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                                            </Text>
                                            <Text style={MarkerInfoBoxStyles.propertyValue}>
                                                {String(value)}
                                            </Text>
                                        </View>
                                    )
                                ))}
                            </>
                        )}
                        
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
                                onPress={() => {
                                    console.log("Directions button pressed");
                                }}
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

export default MarkerInfoBox;