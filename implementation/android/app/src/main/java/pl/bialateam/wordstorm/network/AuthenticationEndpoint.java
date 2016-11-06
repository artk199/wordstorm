package pl.bialateam.wordstorm.network;

import android.util.Log;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import org.json.JSONObject;

import pl.bialateam.wordstorm.StormApplication;

/**
 * Created by Artur on 03.11.2016.
 */

public class AuthenticationEndpoint {

    private static final String TAG = "AuthenticationEndpoint";

    public void login(){
        String url ="http://www.google.com";

        JsonObjectRequest stringRequest = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {

            @Override
            public void onResponse(JSONObject response) {
                Log.d(TAG,response.toString());
            }
        }, new Response.ErrorListener() {

            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG,error.getMessage());
            }

        });
// Add the request to the RequestQueue.
        StormApplication.getRequestQueue().add(stringRequest);

        return;
    }

    public void register(String username, String password) {
        //TODO: implement method.
    }
}
