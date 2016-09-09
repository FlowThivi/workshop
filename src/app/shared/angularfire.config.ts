import { AuthProviders, AuthMethods } from 'angularfire2';

// firebase API configuration
export const myFirebaseConfig = {
  apiKey: "AIzaSyDR2mmzMnymCaZb2VK3lymN-Y5VNtH5kfM",
  authDomain: "a2app-14909.firebaseapp.com",
  databaseURL: "https://a2app-14909.firebaseio.com",
  storageBucket: "a2app-14909.appspot.com",
}

// firebase authentication configuration
export const myFirebaseAuthConfig = {
  method: AuthMethods.Popup
}