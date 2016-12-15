package pl.bialateam.wordstorm.network;

import android.accounts.AuthenticatorException;
import android.util.Log;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.RequestFuture;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import pl.bialateam.wordstorm.activities.StormApplication;
import pl.bialateam.wordstorm.authentication.Authentication;

/**
 * Created by Artur on 03.11.2016.
 */

public class Endpoint {

    private static final String TAG = "Endpoint";

    public boolean block = true;

    public static final String baseURL = "http://wordstormapi.azurewebsites.net/v1/";

    JSONObject doPost(String urlPostfix,JSONObject params){
        return doRequest(Request.Method.POST,urlPostfix,params);
    }

    JSONObject doGet(String urlPostfix){
        return doRequest(Request.Method.GET,urlPostfix,null);
    }

    JSONObject doRequest(int method,String urlPostfix,JSONObject params){

        JSONObject jsonObject = null;

        int status;

        String url = baseURL + urlPostfix;
        Log.d(TAG,"Wołanie: " + url);

        RequestFuture<JSONObject> future = RequestFuture.newFuture();

        final Authentication authentication = StormApplication.getAuthentication();

        JsonObjectRequest stringRequest = new JsonObjectRequest(method, url, params, future, future){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<>();
                if(authentication != null) {
                    headers.put("Authorization", "bearer " + authentication.getToken());
                }
                return headers;
            }

            @Override
            protected Response<JSONObject> parseNetworkResponse(NetworkResponse response) {
                if(response.statusCode != 200){
                    return null;
                }
                return super.parseNetworkResponse(response);
            }
        };

        StormApplication.getRequestQueue().add(stringRequest);

        try {
            if(block)
                jsonObject = future.get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        return jsonObject;
    }

}
