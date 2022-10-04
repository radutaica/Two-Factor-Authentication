import React, {useContext, useState, useEffect} from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {StyleSheet, Dimensions,View, Text,ImageBackground, TouchableOpacity, Alert} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import {auth,db} from '../database/config';
import EmitterContext from '../context/EmitterContext';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);
// code taken from https://firebase.google.com/docs/auth/web/password-auth
const signUserOut = ({navigation}) => {
    auth.signOut()
    .then(() => {
        navigation.navigate('Home')
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
}
const OTPInputScreen = ({navigation}) => {
  //access the passed value and the method 
  const {code,generate} = useContext(EmitterContext)
  const [seconds, setSeconds ] =  useState(10);
  const [time, setTime ] =  useState(50);
  const [resend, setResend] = useState(false);
  const [newcode, setNewCode] = useState(false);
  //resend email with the otp to the user
  //code adapted from https://firebase.google.com/docs/extensions/official/firestore-send-email used the template to send an email
  const sendOTPEmail =() => {
    db.collection('mail').add({
        to: auth.currentUser.email,
        message: {
        messageId: auth.currentUser.uid,
          subject: 'Two Factor Authentication',
          text: 'This is your one time password',
          html: `This is your one time password: ${code}`,
        }
      })
    } 
    //reset the timers and send the email when the button is pressed
  const onButtonResend =() => {
    if (resend == true) {
      setResend(false);
      setSeconds(10);
      sendOTPEmail();
    }
    if (newcode == true){
      setNewCode(false);
      setTime(50);
      
    }
  }
  //50 seconds time window available for the user to input the code or scan it
  //after 50 seconds a new code is generated and the user will not be able to use the old one to log in
  useEffect(()=>{
    const myOTPInterval = setInterval(() => {
            if (time > 0) {
                setTime(time - 1);
            }
            if (time <= 0) {
                setNewCode(true);
                setTime(50);
                generate();
            } 
        }, 1000)
        return ()=> {
            clearInterval(myOTPInterval);
          };
    }, [time]);
    //10 second pause on the resend button to not spam it
  useEffect(()=>{
    const myInterval = setInterval(() => {
          if (seconds > 0) {
              setSeconds(seconds - 1);        
          }
          if (seconds <= 0) {
              setResend(true);             
          } 
      }, 1000)
      return ()=> {
          clearInterval(myInterval);
        };
  }, [seconds]);
    return (

        <View style = {{backgroundColor: 'white', flex: 1,}} 
        >
            <ImageBackground
                source = {require('../assets/picture.jpg')}
                style = {{
                    height:Dimensions.get('window').height
                }}>
                <MaterialIcons style = {{justifyContent: 'center', alignSelf: 'center', paddingTop: 40}} name="lock" size={60} color="black" />
                <Text style = {{fontSize: 36, justifyContent: 'center', alignSelf: 'center',paddingTop: 30, fontWeight: 'bold'}}>OTP verifiy</Text>
                <Text style = {{fontSize: 24, justifyContent: 'center', alignSelf: 'center', paddingTop: 18, color: 'black', paddingBottom: 20}}>Please enter the code sent to you</Text>
                {/* code taken from https://www.npmjs.com/package/@twotalltotems/react-native-otp-input */}
                <OTPInputView
                    style={{paddingLeft:30,width: '90%', height: Dimensions.get('window').height/3}}
                    pinCount={6}
                    autoFocusOnLoad
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    onCodeFilled = {(value) => {if (code ===value){navigation.navigate('Welcome')} else {Alert.alert(`WRONG TRY AGAIN`) }}
                    }
                />
                {/* button can be pressed only when resend value is true
                button also changes color when the user can press the button*/}
                <TouchableOpacity disabled = {!resend} onPress={() => onButtonResend()} style = {{marginTop: 75,justifyContent: 'center', alignSelf: 'center'}}>
                    <Text style = {{color: (resend ===true)? 'blue' : 'red',fontWeight:'bold', fontSize:20}}>Resend OTP</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => signUserOut({navigation})} style = {{marginTop: 75,justifyContent: 'center', alignSelf: 'center'}}>
                    <Text style = {{color: 'black',fontWeight:'bold', fontSize:20}}>Return to home page</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};
const styles = StyleSheet.create({
  borderStyleBase: {
    width: 60,
    height: 70
  },
  borderStyleHighLighted: {
    borderColor: "black",
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  underlineStyleHighLighted: {
    borderColor: "black",
  },
});
export default OTPInputScreen;