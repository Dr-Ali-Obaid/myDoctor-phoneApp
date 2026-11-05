import { ScrollView, View, Text } from "react-native";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import styles from "../styles/profileStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../config/axios";
import { PROFILE_URL } from "../config/urls";
import { transformName } from "../config/helpers";
import { Button, Icon } from "react-native-elements";
import { DELETE_PROFILE_URL } from "../config/urls";
import {useNavigation} from '@react-navigation/native';

const ProfileScreen = (props) => {

  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState();
  const [alert, setAlert] = useState({
    title: "",
    message: "",
    type: ""
  })

  useEffect(() => {
    __getProfile();
  }, []);
  const __getProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access token");
      axios.defaults.headers.common["Authorization"] = "JWT " + token;
      const response = await axios.get(PROFILE_URL);
      console.log(response);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const showAlert = (title, message, type)=>{
    setAlert({
      title: title,
      message: message,
      type, type
    })
    setVisible(true)
  }

  const confirm = (type)=>{
    showAlert(
      type == "delete"? "أنت على وشك حذف" : "أنت على وشك تسجيل الخروج",
      type == "delete"? "هل أنت متأكد من حذف حسابك" : "هل أنت متأكد من تسجيل الخروج",
      type
    )
  }

  const handleAction = async()=>{
    try {
      if(alert.type == "delete"){
        const token = await AsyncStorage.getItem("access token");
        axios.defaults.headers.common["Authorization"] = "JWT " + token;
        response = await axios.delete(DELETE_PROFILE_URL)
        console.log(response)
      }
      await AsyncStorage.clear();
      navigation.navigate("Home")
      setVisible(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Loader loading={loading} />
        <Alert 
        visible={visible}
        type={alert.type}
        title={alert.type}
        message={alert.message}
        onClick = {()=>handleAction()}
        onClose ={()=> setVisible(false)}
        />
        {user && (
          <View>
            <View style={styles.userIconContainer}>
              <View style={styles.userMetaContainer}>
                <View style={styles.userAvtar}>
                  <Text style={styles.userAvtarText}>
                    {transformName(user.name)}
                  </Text>
                </View>
                <View style={styles.userMeta}>
                  <Text>{user.name}</Text>
                  <Text>{user.email}</Text>
                </View>
              </View>
              <View style={styles.iconsConatiner}>
                <Icon
                  name="edit"
                  type="font-awesome"
                  color="#f50"
                  style={{ marginLeft: "5px" }}
                  onPress={()=> navigation.navigate("UpdateProfile")}
                />
                <Icon name="trash" type="font-awesome" color="#f50" onPress={()=>confirm("delete")}/>
              </View>
            </View>
            {user.Profile && (
                <View style={{ marginBottom: "50px" }}>
                  <View style={styles.doctorInfo}>
                    <View style={styles.infoCell}>
                      <Text style={styles.infoTitle}>الاختصاص</Text>
                      <Text style={styles.infoText}>
                        {user.Profile.specialization}
                      </Text>
                    </View>
                    <View style={styles.infoCell}>
                      <Text style={styles.infoTitle}>العنوان</Text>
                      <Text style={styles.infoText}>
                        {user.Profile.address}
                      </Text>
                    </View>
                    <View style={styles.infoCell}>
                      <Text style={styles.infoTitle}>ساعات العمل</Text>
                      <Text style={styles.infoText}>
                        {user.Profile.workingHours}
                      </Text>
                    </View>
                    <View style={styles.infoCell}>
                      <Text style={styles.infoTitle}>الهاتف</Text>
                      <Text style={styles.infoText}>{user.Profile.phone}</Text>
                    </View>
                  </View>
                </View>
              )}
          </View>
        )}
        <Button buttonStyle={styles.logoutButton} title="تسجيل الخروج" onPress={()=>confirm("logout")}/>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
