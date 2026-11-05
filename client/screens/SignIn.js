import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { Button, Text, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../styles/authStyles";
import { Formik } from "formik";
import { object, string } from "yup";
import { SIGNIN_URL } from "../config/urls";
import Loader from "../components/Loader";
import { useState } from "react";
import axios from "../config/axios.js";
import Alert from "../components/Alert";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

export default function SignInScreen(props) {

  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [alert, setAlert] = useState({
    title: "",
    message: "",
    type: "",
  });

  const signInValidationSchema = object({
    email: string()
      .required("البريد الإلكتروني مطلوب")
      .email("يجب عليك إدخال بريد إلكتروني صالح"),
    password: string().required("كلمة المرور مطلوبة"),
  });

  const  __signIn = async(values)=>{
    setLoading(true)
    const body = {
      email: values.email,
      password: values.password
    }
    try {
      const response = await axios.post(SIGNIN_URL, body)
      AsyncStorage.setItem('access token', response.data.accessToken)
      navigation.navigate("Home")
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setAlert({
        title: "تنبيه",
        message: error.response.data.message,
        type: "alert",
      })
      setVisible(true)
    }
  }

  return (
    <ScrollView>
      <Loader loading={loading} title="جاري تسجيل الدخول"/>
      <Alert visible={visible} title={alert.title} message={alert.message} type={alert.type} onClose={()=>setVisible(false)}/>
      <View style={styles.container}>
        <Icon raised name="user" type="font-awesome" color="#f50" size={50} />
        <Text h4>تسجيل الدخول</Text>
      </View>
      <KeyboardAvoidingView behavior="padding" enabled>
        <View style={styles.container}>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={signInValidationSchema}
            onSubmit={(values) => __signIn(values)}
          >
            {({
              handleChange,
              handleSubmit,
              handleBlur,
              values,
              errors,
              isValid,
            }) => (
              <>
                <Input
                  name="email"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholder="البريد الإلكتروني"
                  style={[styles.textInput, errors.email && styles.errorInput]}
                  keyboardType="email-address"
                />
                {errors.email && (
                  <Text p style={styles.textError}>
                    {errors.email}
                  </Text>
                )}

                <Input
                  name="password"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  placeholder=" كلمة المرور"
                  style={[styles.textInput, errors.email && styles.errorInput]}
                  secureTextEntry
                />
                {errors.password && (
                  <Text p style={styles.textError}>
                    {errors.password}
                  </Text>
                )}

                <Button
                  title="دخول"
                  style={{ marginTop: "20px" }}
                  onPress={handleSubmit}
                  disabled={!isValid}
                />
              </>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
