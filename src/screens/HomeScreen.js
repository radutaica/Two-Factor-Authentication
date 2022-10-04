import React, { useState } from 'react';
import {TouchableOpacity,Dimensions,Text,StyleSheet, ScrollView, View,ImageBackground, TextInput} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as yup from 'yup';
import {db, auth} from '../database/config';
//code adapted from https://blog.logrocket.com/react-native-form-validations-with-formik-and-yup/ for the validation schema
const loginFormValidationSchema = yup.object().shape({
    email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is required'),
    password: yup
    .string()
    .min(8,({min}) =>`Password must be at least ${min} characters`)
    .required('Password is required')
    .matches(
        //code taken from https://stackoverflow.com/questions/55451304/formik-yup-password-strength-validation-with-react used the regex
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
});

const HomeScreen = ({navigation}) => {
    //code taken from https://www.freecodecamp.org/news/react-native-firebase-tutorial/
    const onLoginPress = (email,password) => {
            auth
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                const usersRef = db.collection('users')
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert("User does not exist.")
                            return;
                        }
                        navigation.navigate('TwoFA')
                    })
                    .catch(error => {
                        alert(error)
                    });
            })
            .catch(error => {
                alert(error)
            })
    }
    return (
        // code adapted from https://www.youtube.com/watch?v=1FFmawGsZjQ&ab_channel=ReactNativeTutorials for the UI of the app
        //code adapted from https://blog.logrocket.com/react-native-form-validations-with-formik-and-yup/
        <Formik
            initialValues={{ email: '',password: '' }}
            validateOnMount={true}
            validationSchema = {loginFormValidationSchema}
   >
         {({ handleChange, handleBlur, values,touched,errors,isValid }) => (
            // Container Start
            <ScrollView
                style = {{flex:1}}
                showsVerticalScrollIndicator = {false}>
                {/* Upper view*/}
                <ImageBackground
                source = {require('../assets/picture.jpg')}
                style = {{
                    height:Dimensions.get('window').height/2.5
                }}>
                    <View style = {styles.upperView}>
                    <MaterialIcons name="lock" size={60} color="black" />
                        <Text style ={styles.text} >Prototype</Text>
                    </View>
                </ImageBackground>
                {/* Lower view */}
                <View style={styles.lowerView}>
                    {/* Welcome view */}
                        <View style = {{padding: 40}}>
                            <Text style={{color: 'royalblue', fontSize: 34}}>Welcome</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style = {{color: 'royalblue'}}>Don't have an account?
                                <Text style = {{color: 'black', fontStyle: 'italic', paddingLeft: 5}}> {' '}Register now
                                </Text>
                            </Text>
                            </TouchableOpacity>
                        {/* Form Inputs View*/}
                        <View style = {{marginTop: 60}}>
                            <Text style={{color: 'royalblue', fontSize: 16}}> Email:</Text>
                            <TextInput
                                    autoCorrect = {false}
                                    style={styles.TextInput}
                                    placeholderTextColor="royalblue"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                />
                                {(errors.email && touched.email) &&
                                <Text style = {styles.errorMessage}>{errors.email}</Text>
                                }
                        </View>
                        <View>
                            <Text style={{color: 'royalblue', fontSize: 16}}> Password:</Text>
                            <TextInput
                                autoCorrect = {false} 
                                style={styles.TextInput}
                                placeholderTextColor="royalblue"
                                secureTextEntry={true}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                
                            />
                            {(errors.password && touched.password) &&
                            <Text style = {styles.errorMessage}>{errors.password}</Text>
                            }
                        </View>
                        {/* Login Button View */}
                        <View style = {{height:100,justifyContent: 'center', alignItems: 'center', marginBottom: 60, marginTop: 30}}>
                            <TouchableOpacity disabled = {!isValid} onPress={() =>onLoginPress(values.email, values.password)} 
                            style={[styles.button, 
                            {backgroundColor: isValid? "royalblue" : 'gray',}]}>
                                <Text style={styles.buttonText}>Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
         )}
         </Formik>
        // Container End
    );
};
const styles = StyleSheet.create({
    upperView: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center' 
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    lowerView: {
        flex: 1.5,
        backgroundColor: '#ffffff',
        bottom: 60,
        borderTopStartRadius: 60,
        borderTopEndRadius: 60
    },
    TextInput: {
        height: 30,
        flex: 1,
        marginLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginBottom: 15
      },
      button: {
        alignSelf: 'center',
        padding: 20,
        borderRadius: 30,
        width: Dimensions.get('window').width /2,
        justifyContent:'center'
    },
    buttonText: {
        alignSelf: 'center',
        color: "white",
        justifyContent: 'center',
        fontSize: 18
    },
    errorMessage: {
        fontSize:14,
        color: 'red',
        fontWeight: 'bold',
        marginBottom: 10
    }
});
export default HomeScreen;