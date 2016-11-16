package pl.bialateam.wordstorm.authentication;

import android.util.Log;

import pl.bialateam.wordstorm.activities.StormApplication;
import pl.bialateam.wordstorm.network.AuthenticationEndpoint;

/**
 * Provides logic to authenticate user.
 * Created by Artur on 03.11.2016.
 */

public class AuthenticationProvider {

    private static final String TAG = "AuthenticationProvider";

    public boolean authenticate(String username,String password){
        Log.d(TAG,"Logging username: " + username);
        AuthenticationEndpoint authenticationEndpoint = new AuthenticationEndpoint();
        Authentication authentication = authenticationEndpoint.login(username,password);
        if(authentication != null) {
            StormApplication.setAuthentication(authentication);
            Log.d(TAG, "Successfully logged in user: " + username);
            return true;
        }
        return false;
    }

    public boolean registerAndAuthenticate(String username, String password) {
        Log.d(TAG,"Registring user: " + username);
        AuthenticationEndpoint authenticationEndpoint = new AuthenticationEndpoint();
        boolean authenticationResponse = authenticationEndpoint.register(username,password);
        if(authenticationResponse){
            return authenticate(username,password);
        }
        return false;
    }
}
