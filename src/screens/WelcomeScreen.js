import React, { useContext, useEffect, } from 'react';
import {ScrollView,Dimensions,View,Text,StyleSheet, TextInput, TouchableOpacity,ImageBackground} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import {auth} from '../database/config';
const WelcomeScreen= ({navigation}) => {
    // code taken from https://firebase.google.com/docs/auth/web/password-auth
    const signUserOut = () => {
        auth.signOut()
        .then(() => {
            navigation.navigate('Home')
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });}
    return(
        // code adapted from https://www.youtube.com/watch?v=1FFmawGsZjQ&ab_channel=ReactNativeTutorials for styling
        //Upper view
        <ScrollView style = {{backgroundColor: 'white', flex: 1,}} 
        showsVerticalScrollIndicator = {false}>
            <ImageBackground
                source = {require('../assets/picture.jpg')}
                style = {{
                    height:Dimensions.get('window').height/2
                }}>
                <MaterialIcons style = {{justifyContent: 'center', alignSelf: 'center', paddingTop: 80}} name="lock" size={60} color="black" />
                <Text style = {{fontSize: 36, justifyContent: 'center', alignSelf: 'center',paddingTop: 30, fontWeight: 'bold'}}>Welcome!</Text>
                <Text style = {{fontSize: 24, justifyContent: 'center', alignSelf: 'center', paddingTop: 18, color: 'black', paddingBottom: 20}}>Login process successful!</Text>
            </ImageBackground>
            {/*lower view*/}
            <View style = {{backgroundColor: '#ffffff',
                            bottom: 40,
                            borderTopStartRadius: 40,
                            borderTopEndRadius: 40, paddingTop: 20}}>
            <View style = {{height:100,justifyContent: 'center', alignItems: 'center', marginBottom: 60, marginTop: 90}}>
                 <TouchableOpacity onPress={() =>navigation.navigate('Edit')} 
                    style={[styles.button, 
                    {backgroundColor: "royalblue"}]}>
                     <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => signUserOut({navigation})} style = {{marginTop: 75}}>
                    <Text style = {{color: 'royalblue',fontWeight:'bold', fontSize:16}}>Sign out!</Text>
                </TouchableOpacity>
            </View>
            </View>
        </ScrollView>
         );
     };
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
export default WelcomeScreen;