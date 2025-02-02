/**
 * This screen will be responsible for handling directions from one place to another
 */
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Map from "@/components/MapComponents/main";


export default function DirectionsScreen() {
  return (
    <>
      <Map>
        <View style={styles.container}>
          <Text style={styles.text}>Directions Screen</Text>
          {/* Add direction-related components and logic here */}
        </View>
      </Map>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, fontWeight: "bold" },
});
