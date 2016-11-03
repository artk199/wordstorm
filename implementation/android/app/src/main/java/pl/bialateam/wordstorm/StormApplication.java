package pl.bialateam.wordstorm;

import android.app.Application;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

import pl.bialateam.wordstorm.authentication.Authentication;

/**
 * Created by Artur on 03.11.2016.
 */

public class StormApplication extends Application {

    private static RequestQueue requestQueue;
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
