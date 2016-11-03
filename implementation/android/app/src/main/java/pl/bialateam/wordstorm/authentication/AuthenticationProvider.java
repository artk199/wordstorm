package pl.bialateam.wordstorm.authentication;

import android.util.Log;

import pl.bialateam.wordstorm.StormApplication;
import pl.bialateam.wordstorm.network.AuthenticationEndpoint;

/**
 * Provides logic to authenticate user.
 * Created by Artur on 03.11.2016.
 */

public class AuthenticationProvider {

    private static final String TAG = "AuthenticationProvider";

    public boolean authenticate(String username,String password){
        Log.d(TAG,"Logging username: " + username);
        Authentication authentication = new Authentication();
        //TODO: Set current user
        AuthenticationEndpoint authenticationEndpoint = new AuthenticationEndpoint();
        authenticationEndpoint.login();
        authentication.setUsername(username + " aka Jason D");
        StormApplication.setAuthentication(authentication);
        Log.d(TAG,"Successfully logged in user.");
        return true;
    }

}
