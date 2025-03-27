import { SetStateAction, useEffect, useState } from 'react';
import { Button, Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { AND_CLIENT_ID } from '@/constants/GoogleKey';



WebBrowser.maybeCompleteAuthSession();
const useProxyForExpoGo = true;

export default function AuthUser() {
  interface UserInfo {
    name?: string;
    email?: string;
  }

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [, setAccessToken] = useState<string | null>(null);
  const [authInProgress, setAuthInProgress] = useState(false);

  useEffect(() => {

    checkForStoredCredentials();
    

    const subscription = Linking.addEventListener('url', handleRedirect);
    
    return () => {
      subscription.remove();
    };
  }, []);

  const checkForStoredCredentials = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@user');
      const storedToken = await AsyncStorage.getItem('@accessToken');
      
      if (storedUser && storedToken) {
        setUserInfo(JSON.parse(storedUser));
        setAccessToken(storedToken);
      }
    } catch (error) {
      console.error('Error retrieving stored credentials:', error);
    }
  };

  // Handle the redirect back from Google auth
  const handleRedirect = async (event: { url: any; }) => {
    const { url } = event;
    if (url?.includes('access_token=')) {
      try {
        // Extract the access token
        const match = url.match(/access_token=([^&]*)/);
        const token = match?.[1];
        if (token) {
          await getUserInfo(token);
        }
      } catch (error) {
        console.error('Error handling redirect:', error);
      }
      setAuthInProgress(false);
    }
  };

  // Start the Google auth flow
  const handleGoogleAuth = async () => {
    if (authInProgress) return;
    
    setAuthInProgress(true);
    
    try {
      // Get the redirect URL for Expo Go
      const redirectUrl = Linking.createURL('auth');
      
      // Set up scopes for calendar and user info
      const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.readonly profile email');
      
      // Create auth URL using Android client ID
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${AND_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
        `&response_type=token` +
        `&scope=${scope}`;
      
      // Open browser for auth
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
      
      if (result.type === 'success') {
        // The token should be handled by the URL listener
        // but just in case, try to extract it here too
        //if (result.url && result.url.includes('access_token=')) {
        if (result.url?.includes('access_token=')) {
          //const match = result.url.match(/access_token=([^&]*)/);
          const regex = /access_token=([^&]*)/;
          const match = regex.exec(result.url);

          if (match?.[1]) {
            await getUserInfo(match[1]);
          }
        }
      } else {
        setAuthInProgress(false);
        Alert.alert('Authentication canceled or failed');
      }
    } catch (error) {
      console.error('Error during Google auth:', error);
      setAuthInProgress(false);
      if (error instanceof Error) {
        Alert.alert('Authentication Error', error.message);
      } else {
        Alert.alert('Authentication Error', 'An unknown error occurred');
      }
    }
  };

  // Fetch user info using the access token
  const getUserInfo = async (token: SetStateAction<string | null>) => {
    if (!token) return;
    
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const user = await response.json();
      
      if (user.error) {
        console.error('Error in user info response:', user.error);
        Alert.alert('Error', 'Failed to get user information');
        return;
      }
      
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      await AsyncStorage.setItem("@accessToken", token as string);
      setUserInfo(user);
      setAccessToken(token);
    } catch (error) {
      console.error("Error fetching user info:", error);
      Alert.alert('Error', 'Failed to fetch user information');
    }
  };

  // Sign out and clear stored credentials
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("@user");
      await AsyncStorage.removeItem("@accessToken");
      setUserInfo(null);
      setAccessToken(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!userInfo ? (
        <Button 
          title="Connect Google Calendar" 
          onPress={handleGoogleAuth} 
          disabled={authInProgress}
        />
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>
            {userInfo.name ? `Name: ${userInfo.name}` : 'Name not available'}
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20 }}>
            {userInfo.email ? `Email: ${userInfo.email}` : 'Email not available'}
          </Text>
          <Button 
            title="Sign Out" 
            onPress={signOut} 
          />
        </View>
      )}
    </View>
  );
}
