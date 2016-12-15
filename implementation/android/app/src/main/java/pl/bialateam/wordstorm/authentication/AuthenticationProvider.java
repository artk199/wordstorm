package pl.bialateam.wordstorm.authentication;

import android.util.Log;

import pl.bialateam.wordstorm.activities.StormApplication;

/**
 * Provides logic to authenticate user.
 * Created by Artur on 03.11.2016.
 */

public class AuthenticationProvider {

    private static final String TAG = "AuthenticationProvider";

    public boolean authenticate(Authentication authentication){
        Log.d(TAG,"Logging username: " + authentication.getUsername());
        if(authentication != null) {
            StormApplication.setAuthentication(authentication);
            Log.d(TAG, "Successfully logged in user: " + authentication.getUsername());
            return true;
        }
        return false;
    }

}
