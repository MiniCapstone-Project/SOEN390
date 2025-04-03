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
    scopes: ['https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/calendar.readonly'],
    offlineAccess: true, 
    forceCodeForRefreshToken: false, 
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