package pl.bialateam.wordstorm.network;

import android.util.Log;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.toolbox.JsonObjectRequest;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Artur on 11.12.2016.
 */

public class RegisterRequest extends JsonObjectRequest {


    private RegisterRequest(JSONObject jsonRequest, Response.Listener<JSONObject> listener, Response.ErrorListener errorListener) {
        super(Request.Method.POST, Endpoint.baseURL + "Register", jsonRequest, listener, errorListener);
    }

    public static RegisterRequest createRequest(String username,String password, Response.Listener<JSONObject> listener, Response.ErrorListener errorListener){
        JSONObject params = new JSONObject();
        try {
            params.put("Email",username);
            params.put("Password",password);
        } catch (JSONException e) {
            return null;
        }
        return new RegisterRequest(params,listener,errorListener);
    }
}
