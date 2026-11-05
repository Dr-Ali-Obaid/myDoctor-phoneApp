import {
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import { Text } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../styles/authStyles";
import { ProfileForm } from "../components/ProfileForm";
import axios from "../config/axios.js";
import { SIGNUP_URL } from "../config/urls.js";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import Loader from "../components/Loader.js";
import Alert from "../components/Alert.js";
import {useNavigation} from '@react-navigation/native';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [alert, setAlert] = useState({
    title: "",
    message: "",
    type: "",
  });

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    }
    getCurrentLocation();
  }, []);

  const __signUp = async (values) => {
    setLoading(true);
    const body = {
      name: values.name,
      email: values.email,
      password: values.password,
      userType: values.userType ? "doctor" : "normal",
      specialization: values.specialization,
      workingHours: values.workingHours,
      address: values.address,
      phone: values.phone,
      location: {
        latitude: location ? location.latitude : null,
        longitude: location ? location.longitude : null,
      },
    };

    try {
      const response = await axios.post(SIGNUP_URL, body);
      console.log(response);
      setLoading(false);
      setAlert({
        title: "تسجيل ناجح",
        message:
          "لقد قمت بتسجيل حسابك بنجاح، هل تريد الانتقال لصفحة تسجيل الدخول ",
        type: "question",
      });
      setVisible(true);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      } else {
        console.log("حدث خطأ غير متوقع", error.message);
      }
      setLoading(false);
      setAlert({
        title: "تنبيه",
        message: error.response.data.errors[0].message,
        type: "alert",
      });
      setVisible(true);
    }
  };
  return (
    <ScrollView>
      <Loader title="جاري إنشاء حساب جديد" loading={loading} />
      <Alert
        visible={visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={() => setVisible(false)}
        onClick={() => {
          setVisible(false);
          navigation.navigate("SignIn");
        }}
      />
      <View style={styles.container}>
        <Icon raised name="user" type="font-awesome" color="#f50" size={50} />
        <Text h4>صفحة تسجيل مستخدم جديد</Text>
        <KeyboardAvoidingView behavior="padding" enabled>
          <View style={styles.container}>
            <ProfileForm
              submit={(values) => __signUp(values)}
              user={null}
              disabled={false}
              checkBox={true}
              buttonTitle="تسجيل مستخدم جديد"
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
}
