package pl.bialateam.wordstorm.network;

import android.util.Log;

import junit.framework.Assert;

import org.json.JSONException;
import org.json.JSONObject;

import pl.bialateam.wordstorm.authentication.Authentication;

/**
 * Created by Artur on 03.11.2016.
 */

public class AuthenticationEndpoint extends Endpoint {

    private static final String TAG = "AuthenticationEndpoint";

    public Authentication login(String username, String password){

        Authentication authentication = null;

        JSONObject params = new JSONObject();

        try {
            params.put("Email",username);
            params.put("Password",password);
        } catch (JSONException e) {
            Log.e(TAG,"Błąd podczas tworzenia parametrów.",e);
            return authentication;
        }

        try {
            JSONObject jsonObject = doPost("Login",params);
            if(jsonObject == null){
                return null;
            }
            JSONObject result = jsonObject.getJSONObject("Result");
            authentication = new Authentication();
            authentication.setUsername(username);
            authentication.setToken(result.getString("access_token"));
            Log.d(TAG,authentication.getToken());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return authentication;
    }

    public boolean register(String username, String password) {
        Assert.assertTrue(false);
        return true;
    }
}
