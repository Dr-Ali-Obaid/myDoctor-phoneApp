import {
  View,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { Text, Avatar, SearchBar, ListItem } from "react-native-elements";
import { useState, useEffect } from "react";
import axios from "../config/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DOCTORS_URL } from "../config/urls";
import Loader from "../components/Loader";
import { transformName } from "../config/helpers";
import styles from "../styles/doctorsStyles";
import TouchableScale from "react-native-touchable-scale";
import DoctorsDetails from "./DoctorDetails";
export default function DoctorsScreen() {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [value, setValue]= useState("")
  const [selectedDoctors, setSelectedDoctors] = useState(null)

  useEffect(() => {
    const timerId = setTimeout(()=>{
      __getDoctors(value);
    }, 1000)
    return ()=>clearTimeout(timerId)
  }, [value]);

  const __getDoctors = async (query) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access token");
      axios.defaults.headers.common["Authorization"] = `JWT ${token}`;
      const response = await axios.get(DOCTORS_URL, {params: {q: query? query : ""} });
      console.log(response);
      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const itemPressHandler = (itemId)=>
    setSelectedDoctors(doctors.find((doctor)=>
      doctor.id == itemId
    ))
  

  return (
    <View style={styles.container}>
      <Loader loading={loading} title="جاري إحضار الأطباء" />
      <ScrollView>
        <DoctorsDetails selectedDoctors={selectedDoctors} closeModal={()=>setSelectedDoctors(null)}/>
        <KeyboardAvoidingView behavior="padding" enabled>
          <SearchBar
          placeholder="ابحث هنا ..."
          containerStyle={{backgroundColor: "#bfbfbf"}}
          inputContainerStyle={{backgroundColor: "#e5e4ea"}}
          style={{direction: "rtl"}}
          lightTheme
          round
          value={value}
          onChangeText={(text)=>setValue(text)}
          />

          <SafeAreaView>
            {doctors.length !== 0 ? (
              doctors.map((l, i) => (
                <ListItem
                  key={i}
                  Component={TouchableScale}
                  friction={90}
                  tension={100}
                  activeScale={0.9}
                  onPress={()=>itemPressHandler(l.id)}
                >
                  <Avatar
                    rounded
                    size={40}
                    title={transformName(l.name)}
                    containerStyle={{ backgroundColor: "#3d4db7" }}
                  />
                  <ListItem.Content>
                    <ListItem.Title>{l.name}</ListItem.Title>
                    <ListItem.Subtitle>
                      {l.Profile?.specialization ?? "غير محدد"}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              ))
            ) : (
              <Text style={styles.noDoctorsText}>لا يوجد لدينا أطباء</Text>
            )}
          </SafeAreaView>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}
