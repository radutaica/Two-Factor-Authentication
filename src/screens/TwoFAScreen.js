import React, { useContext, useEffect, } from 'react';
import {ScrollView,Dimensions,View,Text,StyleSheet,TouchableOpacity,ImageBackground} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import {db, auth} from '../database/config';
import EmitterContext from '../context/EmitterContext';
const TwoFAScreen= ({navigation}) => {
    const {code, generate} = useContext(EmitterContext);
    //generate a 6 digit code when this method is first rendered
    useEffect(() => {

        generate();
    },[])
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
    //send an email with a 6 digit random code generated above to the current user's email address
    //code adapted from https://firebase.google.com/docs/extensions/official/firestore-send-email used the template to send an email
    const sendOTPEmail =() => {
            db.collection('mail').add({
                to: auth.currentUser.email,
                message: {
                messageId: "auth.currentUser.uid",
                  subject: 'Two Factor Authentication',
                  text: 'This is your one time password',
                  html: `This is your one time password: ${code}`,
                }
              })
              .then(() => navigation.navigate('OTP'));
            }   
    //send an email with a QR code to the current user's email address
    const sendQRCode = ({navigation}) => {
        //code adapted from https://firebase.google.com/docs/extensions/official/firestore-send-email used the template to send an email
            db.collection('mail').add({
                to: auth.currentUser.email,
                message: {
                messageId: auth.currentUser.uid,
                  subject: 'Two Factor Authentication',
                  text: 'This is your one time password',
                  //generate a QR code in html using the 6 digit code as the value so that it can be displayed in an email
                  //code taken from https://stackoverflow.com/questions/30115242/generating-a-simple-qr-code-with-just-html to generate the QR code in html using the 6 digit code as the data
                  html: `<html>
                        <head>
                            <title>QR code</title>
                            <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
                        </head>
                        <body>
                            <img id='barcode' 
                                src="https://api.qrserver.com/v1/create-qr-code/?data=${code}&amp;size=100x100" 
                                alt="" 
                                title="QR Code" 
                                width="300" 
                                height="300" />
                        </body>
                        </html>`
                }
              }).then(() => navigation.navigate('QR'));         
            }
    return(
        // code adapted from https://www.youtube.com/watch?v=1FFmawGsZjQ&ab_channel=ReactNativeTutorials for the styling idea of the screen
        //upper view
        <ScrollView style = {{backgroundColor: 'white', flex: 1,}} 
        showsVerticalScrollIndicator = {false}>
            <ImageBackground
                source = {require('../assets/picture.jpg')}
                style = {{
                    height:Dimensions.get('window').height/2
                }}>
                <MaterialIcons style = {{justifyContent: 'center', alignSelf: 'center', paddingTop: 60}} name="lock" size={60} color="black" />
                <Text style = {{fontSize: 36, justifyContent: 'center', alignSelf: 'center',paddingTop: 30, fontWeight: 'bold'}}> {"   "}Two Factor Authentication</Text>
                <Text style = {{fontSize: 24, justifyContent: 'center', alignSelf: 'center', paddingTop: 18, color: 'black', paddingBottom: 20}}>Choose Your Option</Text>
            </ImageBackground>
            {/*lower view*/}
            <View style = {{backgroundColor: '#ffffff',
                            bottom: 40,
                            borderTopStartRadius: 40,
                            borderTopEndRadius: 40, paddingTop: 20}}>
            <View style = {{height:100,justifyContent: 'center', alignItems: 'center', marginBottom: 60, marginTop: 90}}>
                 <TouchableOpacity onPress={() =>sendOTPEmail()} 
                    style={[styles.button, 
                    {backgroundColor: "royalblue"}]}>
                     <Text style={styles.buttonText}>One Time Password</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> sendQRCode({navigation})} 
                    style={[styles.button, 
                    {backgroundColor: "royalblue"}]}>
                     <Text style={styles.buttonText}>QR Code</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => signUserOut({navigation})} style = {{marginTop: 75}}>
                    <Text style = {{color: 'royalblue',fontWeight:'bold', fontSize:16}}>Return to home page</Text>
                </TouchableOpacity>
            </View>
            </View>
        </ScrollView>
         )};

const styles = StyleSheet.create({
    smallInput: {
        backgroundColor:'lightsteelblue',
        borderWidth: 1,
        borderColor: 'black',
        padding: 8,
        marginLeft: 20,
        marginTop: 50,
        width: 180,
        height: 50
    },
    bigInput: {
        backgroundColor:'lightsteelblue',
        borderWidth: 1,
        borderColor: 'black',
        padding: 8,
        marginLeft: 20,
        marginTop: 30,
        width: 380,
        height: 50
    },
    button: {
        alignSelf: 'center',
        padding: 20,
        marginTop: 40,
        borderRadius: 30,
        width: Dimensions.get('window').width /1.5,
        justifyContent:'center'
    },
    buttonText: {
        alignSelf: 'center',
        color: "white",
        justifyContent: 'center',
        fontSize: 18
    },
    errorMessage: {
        fontSize:12,
        color: 'red',
        fontWeight: 'bold',
        marginLeft: 20,    
    }
});
export default TwoFAScreen;