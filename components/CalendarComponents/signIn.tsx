// import statusCodes along with GoogleSignin
import {
    GoogleSignin,
    statusCodes,
    isErrorWithCode
  } from '@react-native-google-signin/google-signin';
import { getCalendarEvents } from './CalendarEvent';
 
 
 
 export const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log(response.data?.user)
      getCalendarEvents();

    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
           console.log("1") // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("2") // operation (eg. sign in) already in progress
            // Android only, play services not available or outdated
            break;
          default:
            console.log("3") // operation (eg. sign in) already in progress

          // some other error happened
        }
      } else {
        console.log("4") // operation (eg. sign in) already in progress
    }
    }
  };