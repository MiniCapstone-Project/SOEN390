import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import {COURSES_CALENDAR_ID} from '../../constants/GoogleKey';

export const getCalendarEvents = async () => {
  try {
    // Ensure the user is signed in
    const userInfo = await GoogleSignin.signIn();
    console.log("1");
    const {accessToken} = await GoogleSignin.getTokens(); // You will use the ID token to authenticate
    console.log("2");
    console.log(new Date().toISOString());

    // Make an authenticated request to the Google Calendar API
    const response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/${COURSES_CALENDAR_ID}/events`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        timeMin: new Date().toISOString(),  // Set a broader time range, like a past date
        singleEvents: true,
        orderBy: 'startTime',
        
      }
    });

    


    if (response.data.items && response.data.items.length > 0) {
      console.log('Courses Calendar Events:', response.data.items);
    } else {
      console.log('No events found in the "courses" calendar.');
    }
  } catch (error) {
    console.error('Error fetching calendar events:', error);
  }
};
