import React from 'react';
import {ScrollView,Dimensions,View,Text,StyleSheet, TextInput, TouchableOpacity,ImageBackground} from 'react-native'
import { Formik } from 'formik';
import * as yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';
import {db, auth} from '../database/config';
// Form validation
//code adapted from https://blog.logrocket.com/react-native-form-validations-with-formik-and-yup/ for the validation schema
const registerFormValidationSchema = yup.object().shape({
    email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is required'),
    firstName: yup
    .string()
    .max(40)
    .required('First name is required'),
    lastName: yup
    .string()
    .max(40)
    .required('Last name is required'),
    phone: yup
    .string()
    .required("Phone number is Required")
    .min(7,({min}) =>`Phone number must be at least ${min} digits`)
    .max(15,({max}) =>`Phone number must be less than ${max} digits`)
    // code taken from https://stackoverflow.com/questions/52483260/validate-phone-number-with-yup used the regex
    .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        "Phone number is not valid"
      ),
    password: yup
    .string()
    .min(8,({min}) =>`Password must be at least ${min} characters`)
    .required('Password is required')
    //code taken from https://stackoverflow.com/questions/55451304/formik-yup-password-strength-validation-with-react used the regex
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    passwordConfirmation: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});
//update the current user data with the new data

const UserUpdate = (email,password,firstName,lastName,phone,{navigation}) =>{
    const usersRef = db.collection('users')
    const currentUserUID = auth.currentUser.uid
    const data = {
        id: currentUserUID,
        email,
        firstName,
        lastName,
        phone
    };
    usersRef.doc(currentUserUID).set(data).catch((error) => {
        
    });
    auth.currentUser.updateEmail(email).then(() => {
        auth.currentUser.updatePassword(password).then(() => {
          }).catch((error) => {
            alert(error)
          });
      }).catch((error) => {
        alert(error)
      });
      navigation.navigate('Welcome')
}
const EditProfileScreen = ({navigation}) => {
    // code adapted from https://www.youtube.com/watch?v=1FFmawGsZjQ&ab_channel=ReactNativeTutorials for the UI of the app
    //code adapted from https://blog.logrocket.com/react-native-form-validations-with-formik-and-yup/
    return(
        <Formik
     initialValues={{ email: '', password: '', firstName: '', lastName: '', phone: '', passwordConfirmation: ''  }}
     validateOnMount = {true}
     validationSchema = {registerFormValidationSchema}
    >
     {({ handleChange, handleBlur, values,touched,errors,isValid }) => (
         //upper view
        <ScrollView style = {{backgroundColor: 'white', flex: 1,}} 
        showsVerticalScrollIndicator = {false}>
            <ImageBackground
                source = {require('../assets/picture.jpg')}
                style = {{
                    height:Dimensions.get('window').height/4
                }}>
                <MaterialIcons style = {{justifyContent: 'center', alignSelf: 'center', paddingTop: 20}} name="lock" size={60} color="black" />
                <Text style = {{fontSize: 36, justifyContent: 'center', alignSelf: 'center',paddingTop: 8, fontWeight: 'bold'}}>Update Your Profile!</Text>
            </ImageBackground>
            <View style = {{backgroundColor: '#ffffff',
                            bottom: 40,
                            borderTopStartRadius: 40,
                            borderTopEndRadius: 40, paddingTop: 20}}>
            <TextInput style = {styles.bigInput} autoCorrect = {false} placeholder = 'First Name' onChangeText={handleChange('firstName')}
           onBlur={handleBlur('firstName')}
           value={values.firstName} />
           {(errors.firstName && touched.firstName) &&
           <Text style ={styles.errorMessage}>{errors.firstName}</Text>}
            <TextInput style = {styles.bigInput} autoCorrect = {false} placeholder = 'Last Name' onChangeText={handleChange('lastName')}
           onBlur={handleBlur('lastName')}
           value={values.lastName} />
           {(errors.lastName && touched.lastName) &&
           <Text style ={styles.errorMessage}>{errors.lastName}</Text>}

            <TextInput style = {styles.bigInput} autoCorrect = {false} placeholder = 'Email' onChangeText={handleChange('email')}
           onBlur={handleBlur('email')}
           value={values.email}/>
           {(errors.email && touched.email) &&
           <Text style ={styles.errorMessage}>{errors.email}</Text>}
            <TextInput style = {styles.bigInput} autoCorrect = {false} placeholder = 'Phone number' onChangeText={handleChange('phone')}
           onBlur={handleBlur('phone')}
           value={values.phone}/>
           {(errors.phone && touched.phone) &&
           <Text style ={styles.errorMessage}>{errors.phone}</Text>}
            <TextInput style = {styles.bigInput} autoCorrect = {false} placeholder = 'Password' onChangeText={handleChange('password')}
           onBlur={handleBlur('password')}
           secureTextEntry={true}
           value={values.password}/>
           {(errors.password && touched.password) &&
           <Text style ={styles.errorMessage}>{errors.password}</Text>}
            <TextInput style = {styles.bigInput} autoCorrect = {false} placeholder = 'Confirm Password' onChangeText={handleChange('passwordConfirmation')}
           onBlur={handleBlur('passwordConfirmation')}
           secureTextEntry={true}
           value={values.passwordConfirmation}/>
           {(errors.passwordConfirmation && touched.passwordConfirmation) &&
           <Text style ={styles.errorMessage}>{errors.passwordConfirmation}</Text>}
            {/* Buttons view */}
            <View style = {{height:100,justifyContent: 'center', alignItems: 'center', marginBottom: 60, marginTop: 30}}>
                 <TouchableOpacity disabled = {!isValid} onPress={() => UserUpdate(values.email,values.password,values.firstName,values.lastName,values.phone,{navigation})} 
                    style={[styles.button, 
                    {backgroundColor: isValid? "royalblue" : 'gray',}]}>
                     <Text style={styles.buttonText}>Update Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style = {{paddingTop: 20}}>
                    <Text style = {{color: 'royalblue',fontWeight:'bold', fontSize:16}}>Return to home page</Text>
                </TouchableOpacity>
            </View>
            </View>
        </ScrollView>
         )}
         </Formik>
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
        fontSize:12,
        color: 'red',
        fontWeight: 'bold',
        marginLeft: 20,
    }
});
export default EditProfileScreen;