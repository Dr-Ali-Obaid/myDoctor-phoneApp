import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
       flex: 1,
       justifyContent: 'center',
       writingDirection: 'rtl',
       alignItems: 'center',
       marginTop: 50 // بدون px
   },
   checkBoxContainer: {
       flexDirection: 'row-reverse',
   },
   checkbox: {
       borderWidth: 0,
       backgroundColor: 'transparent',
       writingDirection: 'rtl'
   },
   icon: {
       fontSize: 25 // بدون 'px'
   },
   textInput: {
       height: 40,
       width: '100%',
       writingDirection: 'rtl',
       textAlign: 'right'
   },
   errorInput: {
       borderWidth: 1,
       borderColor: 'red',
       borderRadius: 5,
   },
   textError: {
       textAlign: 'right',
       fontSize: 12,
       color: 'red',
       marginBottom: 10
   },
   mapContainer: {
       height: 200,
       marginTop: 20,
       width: '90%'
   },
   map: {
       flex: 1,
   }
});

export default styles;
