package pl.bialateam.wordstorm.activities;

import android.app.Application;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

import pl.bialateam.wordstorm.authentication.Authentication;

/**
 * Created by Artur on 03.11.2016.
 */

public class StormApplication extends Application {

    //API request queue
    private static RequestQueue requestQueue;

    //Logged in user details
    private static Authentication authentication;

    @Override
    public void onCreate() {
        super.onCreate();
        requestQueue = Volley.newRequestQueue(this);
    }

    public static RequestQueue getRequestQueue() {
        return requestQueue;
    }

    public static Authentication getAuthentication() {
        return authentication;
    }

    public static void setAuthentication(Authentication authentication) {
        StormApplication.authentication = authentication;
    }

}
