import {  ImageBackground, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "../styles/homeStyles"
import { useState, useEffect } from 'react';


export default function HomeScreen(){
  const navigation = useNavigation();
  const [token, setToken]=useState("")
  
  useEffect(() => {
    const refreshToken = navigation.addListener('focus', () => {
      _checkToken();
    })
   return refreshToken
  }, [navigation])

  const _checkToken = async ()=>{
    const getToken = await AsyncStorage.getItem("access token")
    setToken(getToken)
  }
  return (
   <ImageBackground 
   source={require('../assets/doc-bg2.jpg')}
   style={styles.background}
   >
    <View style={styles.container}>
      <Text style={styles.title}>أهلا بك في تطبيق طبيب</Text>
      <Text style={styles.text}> للربط بين الأطباء والمرضى </Text>
      {
        token?
        <>
        <Button title="صفحة الأطباء" onPress={()=> navigation.navigate("Doctors")}/>
        <Button type='clear' title="الصفحة الشخصية" onPress={()=>navigation.navigate("Profile")}>
          <Text style={styles.lableButton}>استعراض الملف الشخصي</Text>
        </Button>
        </>
        :
        <>
        <Button title="تسجيل الدخول " onPress={()=> navigation.navigate("SignIn")}/>
        <Button type='clear' title="تسجيل مستخدم جديد " onPress={()=>navigation.navigate("SignUp")}>
          <Text style={styles.lableButton}> إنشاء حساب</Text>
        </Button>
        </>
      }
    </View>
   </ImageBackground>
  );
}


