package pl.bialateam.wordstorm.network.auth;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;

import org.json.JSONException;
import org.json.JSONObject;

import pl.bialateam.wordstorm.activities.StormApplication;
import pl.bialateam.wordstorm.network.Endpoint;
import pl.bialateam.wordstorm.network.WordStormRequest;

/**
 * Created by Artur on 11.12.2016.
 */

public class RegisterRequest extends WordStormRequest {


    private RegisterRequest(JSONObject jsonRequest, Response.Listener<JSONObject> listener, Response.ErrorListener errorListener) {
        super(Request.Method.POST, Endpoint.baseURL + "Register", jsonRequest, listener, errorListener);
    }

    public static void createRequest(String username,String password, Response.Listener<JSONObject> listener, Response.ErrorListener errorListener){
        JSONObject params = new JSONObject();
        try {
            params.put("Email",username);
            params.put("Password",password);
        } catch (JSONException e) {
            e.printStackTrace();
            return ;
        }
        RegisterRequest request = new RegisterRequest(params,listener,errorListener);
        StormApplication.getRequestQueue().add(request);
    }

}
