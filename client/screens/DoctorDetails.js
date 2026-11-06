import React from "react";
import MapView, { Marker } from "react-native-maps";
import { transformName } from "../config/helpers";
import styles from "../styles/profileStyles";
import { View } from "react-native";
import { Overlay, Button, Avatar, Text } from "react-native-elements";

const DoctorsDetails = ({ selectedDoctors, closeModal }) => {
  // Return null safely if no doctor is currently selected
  if (!selectedDoctors) {
    return null;
  }

  // Safely extract profile properties with fallback defaults
  const profile = selectedDoctors.Profile || {};
  const latitude = parseFloat(selectedDoctors.latitude || profile.latitude);
  const longitude = parseFloat(selectedDoctors.longitude || profile.longitude);
  const hasCoordinates = !isNaN(latitude) && !isNaN(longitude);

  return (
    <Overlay isVisible={Boolean(selectedDoctors)} fullScreen>
      <View style={styles.container}>
        <View style={styles.userMetaContainer}>
          <Avatar
            size={40}
            rounded
            title={transformName(selectedDoctors.name || "")}
            containerStyle={{ backgroundColor: "#3d4db7" }}
          />
          <View style={styles.userMeta}>
            <Text>{selectedDoctors.name || "طبيب"}</Text>
            <Text>{selectedDoctors.email || ""}</Text>
          </View>
        </View>

        <View style={styles.doctorInfo}>
          <View style={styles.infoCell}>
            <Text style={styles.infoTitle}>الاختصاص</Text>
            <Text style={styles.infoText}>
              {profile.specialization || "غير محدد"}
            </Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoTitle}>العنوان</Text>
            <Text style={styles.infoText}>{profile.address || "غير محدد"}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoTitle}>ساعات العمل</Text>
            <Text style={styles.infoText}>
              {profile.workingHours || "غير محدد"}
            </Text>
          </View>
          <View style={styles.lastCell}>
            <Text style={styles.infoTitle}>رقم الهاتف</Text>
            <Text style={styles.infoText}>{profile.phone || "غير محدد"}</Text>
          </View>
        </View>

        {hasCoordinates && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                }}
              />
            </MapView>
          </View>
        )}

        <Button
          containerStyle={{ marginTop: 40 }}
          title="عودة"
          onPress={closeModal}
        />
      </View>
    </Overlay>
  );
};

export default DoctorsDetails;
