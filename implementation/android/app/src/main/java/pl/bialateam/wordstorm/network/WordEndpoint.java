package pl.bialateam.wordstorm.network;

import android.util.Log;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.RequestFuture;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import pl.bialateam.wordstorm.activities.StormApplication;
import pl.bialateam.wordstorm.authentication.Authentication;
import pl.bialateam.wordstorm.pojo.Word;

/**
 * Created by Artur on 06.12.2016.
 */
public class WordEndpoint extends Endpoint {

    private static final String TAG = "WordEndpoint";

    private static WordEndpoint ourInstance = new WordEndpoint();

    public static WordEndpoint getInstance() {
        return ourInstance;
    }

    private WordEndpoint() {
        this.block = false;
    }

    public void setWordToKnown(Word word, boolean isKnown){
        JSONArray params = new JSONArray();
        JSONObject object = new JSONObject();
        try {
            object.put("id",word.getId());
            object.put("isKnown",isKnown);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        params.put(object);

        Log.d(TAG,word.toString());

        doRequest("Word/Tier",params);
    }


    void doRequest(String urlPostfix,JSONArray params){

        JSONArray jsonObject = null;

        int status;

        String url = baseURL + urlPostfix;
        Log.d(TAG,"Wołanie: " + url);

        final Authentication authentication = StormApplication.getAuthentication();

        JsonArrayRequest stringRequest = new JsonArrayRequest(Request.Method.POST, url, params, null, null){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<>();
                if(authentication != null) {
                    headers.put("Authorization", "bearer " + authentication.getToken());
                }
                return headers;
            }

            @Override
            protected Response<JSONArray> parseNetworkResponse(NetworkResponse response) {
                if(response.statusCode != 200){
                    return super.parseNetworkResponse(response);
                }
                return super.parseNetworkResponse(response);
            }
        };

        stringRequest.setShouldCache(false);
        StormApplication.getRequestQueue().add(stringRequest);

        return;
    }

}
