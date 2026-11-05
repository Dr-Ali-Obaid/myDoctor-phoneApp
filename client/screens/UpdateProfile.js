import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import { Text, Icon } from "react-native-elements";

import { useState, useEffect } from "react";
import axios from "../config/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UPDATE_PROFILE_URL, PROFILE_URL } from "../config/urls";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import styles from "../styles/authStyles";
import {ProfileForm} from "../components/ProfileForm";
import {useNavigation} from '@react-navigation/native';

function UpdateProfileScreen(props) {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({
    title: "",
    message: "",
    type: ""
  })
  const navigation = useNavigation()

  const __getProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access token");
      axios.defaults.headers.common["Authorization"] = `JWT ${token}`;
      const response = await axios.get(PROFILE_URL);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const __updateProfile = async(values)=>{
    setLoading(true)
    const body = {
      name: values.name,
      password: values.password,
      userType: values.userType? "doctor" : "normal",
      specialization: values.specialization,
      workingHours: values.workingHours,
      address: values.address, 
      phone: values.phone,
      location:{
        latitude: values.latitude || null,
        longitude: values.longitude || null
      }
    }
    try {
      const response = await axios.put(UPDATE_PROFILE_URL, body)
      setLoading(false)
      setUser(response.data);
      setAlert({title: "تنبيه" , message: "تم تعديل بيانات حسابك بنجاح", type: "alert"})
      setVisible(true)
      
      navigation.replace("Profile")
      
    } catch (error) {
      console.log(error)
      setLoading(false)
      setAlert({title: "خطأ" , message: error.response.data.errors[0], type: "alert"})
      setVisible(true)
    }
  }

  useEffect( ()=>{
    __getProfile()
  }, [])

  return (
    <ScrollView>
      <Loader loading={loading} />
      <Alert visible={visible} title={alert.title} message={alert.message} type={alert.type} onClose={()=>setVisible(false)}/>
      {user &&
      <>
      <View style= {styles.container}>
        <Icon
        raised
        size={50}
        name="user"
        type="font-awesome"
        color="#f50"
        />
        <Text h4>تعديل بيانات المستخدم </Text>
      </View>
      <KeyboardAvoidingView behavior="paddig" enabled>
        <View style={styles.container}>
          <ProfileForm
          user={user}
          submit={(values)=> __updateProfile(values)}
          checkBox={false}
          buttonTitle="تعديل البيانات "
          disabled={true}
          />
        </View>
      </KeyboardAvoidingView>
      </>
      }
    </ScrollView>
  );
}
export default UpdateProfileScreen;
