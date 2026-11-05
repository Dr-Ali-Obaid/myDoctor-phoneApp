import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import styles from "../styles/authStyles";

function MapViewComponent(props) {
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        provider="google"
        initialRegion={{
          latitude: props.location.latitude,
          longitude: props.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          draggable
          coordinate={{
            latitude: props.location.latitude,
            longitude: props.location.longitude,
          }}
          onDragEnd={(e) => {
            props.latitude(e.nativeEvent.coordinate.latitude);
            props.longitude(e.nativeEvent.coordinate.longitude);
          }}
        />
      </MapView>
    </View>
  );
}

export default MapViewComponent;
