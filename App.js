import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from './src/screens/HomeScreen';
import RegistrationScreen from "./src/screens/RegistrationScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import TwoFAScreen from "./src/screens/TwoFAScreen";
import QRScreen from "./src/screens/QRScreen";
import OTPInputScreen from "./src/screens/OTPInputScreen";
import { EmitterProvider } from "./src/context/EmitterContext";
import WelcomeScreen from "./src/screens/WelcomeScreen";
const navigator = createStackNavigator(
  {
  Home: HomeScreen,
  Register: RegistrationScreen,
  Edit: EditProfileScreen,
  TwoFA: TwoFAScreen,
  OTP: OTPInputScreen,
  QR: QRScreen,
  Welcome: WelcomeScreen
}, {
  initialRouteName: 'Home',
  defaultNavigationOptions: {
    title: 'Prototype'
  }
});
const App = createAppContainer(navigator);
export default () => {
  return <EmitterProvider>
    <App />
    </EmitterProvider>
};