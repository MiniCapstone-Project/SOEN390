import { WEB_CLIENT_ID } from '@/constants/GoogleKey';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';
  import { View, Alert, ScrollView, Dimensions, Text, Modal, TouchableOpacity, StatusBar } from "react-native";
import { signIn } from './signIn';




  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
  });


  export default function GoogleSign () {
return (

<View>
    <Text>I AM BACKKKKK</Text>
    <GoogleSigninButton
    size={GoogleSigninButton.Size.Wide}
    color={GoogleSigninButton.Color.Dark}
    onPress={signIn}/>
    <StatusBar ></StatusBar>
</View>
);
  }