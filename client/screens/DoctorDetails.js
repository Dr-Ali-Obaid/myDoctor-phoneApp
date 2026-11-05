import React from "react";
import MapView, { Marker } from "react-native-maps";
import { transformName } from "../config/helpers";
import styles from '../styles/profileStyles'
import { View } from "react-native";
import { Overlay, Button, Avatar, Text } from "react-native-elements";

const DoctorsDetails = ({selectedDoctors, closeModal})=>{

    if(selectedDoctors){
        return(
            <Overlay isVisible={selectedDoctors !== null} fullScreen>
               
                     <View style={styles.container}>
                     <View style={styles.userMetaContainer}>
                         <Avatar
                         size={40}
                         rounded
                         title={transformName(selectedDoctors.name)}
                         containerStyle={{backgroundColor: "#3d4db7"}}
                         />
                         <View style={styles.userMeta}>
                             <Text>{selectedDoctors.name}</Text>
                             <Text>{selectedDoctors.email}</Text>
                         </View>
                     </View>
                     <View style={styles.doctorInfo}>
                         <View style={styles.infoCell}>
                             <Text style={styles.infoTitle}>الاختصاص</Text>
                             <Text style={styles.infoText}>{selectedDoctors.Profile.specialization}</Text>
                         </View>
                         <View style={styles.infoCell}>
                             <Text style={styles.infoTitle}>العنوان</Text>
                             <Text style={styles.infoText}>{selectedDoctors.Profile.address}</Text>
                         </View>
                         <View style={styles.infoCell}>
                             <Text style={styles.infoTitle}>ساعات العمل</Text>
                             <Text style={styles.infoText}>{selectedDoctors.Profile.workingHours}</Text>
                         </View>
                         <View style={styles.lastCell}>
                             <Text style={styles.infoTitle}>رقم الهاتف</Text>
                             <Text style={styles.infoText}>{selectedDoctors.Profile.phone}</Text>
                         </View>
                     </View>
                     {selectedDoctors.latitude &&
                     <View style={styles.mapContainer}>
                         <MapView 
                         style={styles.map}
                         initialRegion={{
                             latitude: selectedDoctors.latitude,
                             longitude: selectedDoctors.longitude,
                             latitudeDelta: 0.01,
                             longitudeDelta: 0.01
                         }}
                         provider="google"
                         >
                             <Marker
                             coordinate={{
                                 longitude: selectedDoctors.longitude,
                                 latitude: selectedDoctors.latitude
                             }}
                             />
                         </MapView>
                     </View>
                     }
                     <Button style={{marginTop: "40px"}} title="عودة" onPress={closeModal}/>
                 </View>
                
            </Overlay>
        )
    }
   
}

export default DoctorsDetails