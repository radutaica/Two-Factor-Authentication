import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Button,ImageBackground, TouchableOpacity,  } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import EmitterContext from '../context/EmitterContext';
import {auth,db} from '../database/config';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);
export default function App({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const {code,generate} = useContext(EmitterContext)
  const [seconds, setSeconds ] =  useState(10);
  const [time, setTime ] =  useState(50);
  const [resend, setResend] = useState(false);
  const [newcode, setNewCode] = useState(false);     
  //resend qr code
  //code adapted from https://firebase.google.com/docs/extensions/official/firestore-send-email used the template to send an email
  const sendQRCode = () => {
    db.collection('mail').add({
        to: auth.currentUser.email,
        message: {
        messageId: auth.currentUser.uid,
          subject: 'Two Factor Authentication',
          text: 'This is your one time password',
          //code taken from https://stackoverflow.com/questions/30115242/generating-a-simple-qr-code-with-just-html to generate the QR code in html using the 6 digit code as the data
          html: `<html>
                <head>
                    <title>QR Code</title>
                    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
                </head>
                <body>
                    <img id='barcode' 
                        src="https://api.qrserver.com/v1/create-qr-code/?data=${code}&amp;size=100x100" 
                        alt="" 
                        title="HELLO" 
                        width="300" 
                        height="300" />
                </body>
                </html>`
        }
      });
    }
    //reset timers and send qr code again when button pressed
  const onButtonResend =() => {
    if (resend == true) {
      setResend(false);
      setSeconds(10);
      sendQRCode();      
    }
    if (newcode == true){
      setNewCode(false);
      setTime(30);      
    }
  }
  //50 seconds time window to use the qr code
  useEffect(()=>{
    const myQRCodeInterval = setInterval(() => {
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
            clearInterval(myQRCodeInterval);
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
  //request permission to use the camera
 //code taken from https://docs.expo.dev/versions/latest/sdk/bar-code-scanner/
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({data }) => {
    setScanned(true);
    if (data === code) {
      alert ("QR codes match!")
      navigation.navigate('Welcome')
    }
    else{
      alert ("QR codes do not match! Try again or press the Resend QR Code button")
    }
  };
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
     {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      <View>  
             <TouchableOpacity disabled = {!resend} onPress={() => onButtonResend()} style = {{marginTop: 370,justifyContent: 'center', alignSelf: 'center'}}>
                    <Text style = {{color: (resend ===true)? 'blue' : 'red',fontWeight:'bold', fontSize:20}}>Resend QR code</Text>
              </TouchableOpacity>
      </View>
    </View> 
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,  
    flexDirection: 'column',
    justifyContent: 'center',
  },
});