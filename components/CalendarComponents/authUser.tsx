import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { WEB_CLIENT_ID } from "../../constants/GoogleKey";

WebBrowser.maybeCompleteAuthSession();
const CLIENT_ID = WEB_CLIENT_ID;
const SCOPES = encodeURI('https://www.googleapis.com/auth/calendar.readonly');
const RESPONSE_TYPE = 'token';

export default function App() {
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync ] = Google.useAuthRequest({
    androidClientId: CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly']
  }); 

  async function handleSignIn (){
    const user = await AsyncStorage.getItem("@user");
    if(!user){

    }
    else {
        setUserInfo(JSON.parse(user))
    }
  };

   const getUserInfo = async (token) => {
 if(!token) return;
 try {
    const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
    {
          headers: {Authorization : `Bearer ${token}`}
    }
);
const user = await response.json();
await AsyncStorage.setItem("@user", JSON.stringify(user));
setUserInfo(user);
 }
 catch (error){
    console.log(error);
 }
 
 };

  console.log(userInfo.access_token);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!userInfo ? (
        <Button title="Connect Google Calendar" onPress={promptAsync} />
      ) : (
        <Text>Access Token: {userInfo.access_token}</Text>
      )}
    </View>
  );
}
