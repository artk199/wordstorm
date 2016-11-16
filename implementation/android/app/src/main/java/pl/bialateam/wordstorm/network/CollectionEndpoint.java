package pl.bialateam.wordstorm.network;

import android.util.Log;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import pl.bialateam.wordstorm.authentication.Authentication;
import pl.bialateam.wordstorm.pojo.Collection;
import pl.bialateam.wordstorm.pojo.Word;

/**
 * Created by Artur on 11.11.2016.
 */

public class CollectionEndpoint extends Endpoint {

    private static final String TAG = "CollectionEndpoint";

    public List<Collection> getAllCollections() {

        ArrayList<Collection> collections = new ArrayList<>();

        Gson gson = new GsonBuilder()
                .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
                .setPrettyPrinting()
                .create();

        try {
            JSONObject jsonObject = doGet("Collection");
            if(jsonObject == null){
                return null;
            }
            JSONArray result = jsonObject.getJSONArray("Result");
            Log.d(TAG,"result : " + result);
            for (int i = 0; i < result.length(); i++) {
                JSONObject collectionJson = result.getJSONObject(i);
                String jsonString = collectionJson.toString();
                Collection collection = gson.fromJson(jsonString,Collection.class);
                collections.add(collection);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return collections;
    }


    public List<Word> getAllWordsForCollection(Collection collection) {

        ArrayList<Word> words = new ArrayList<>();

        Gson gson = new GsonBuilder()
                .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
                .setPrettyPrinting()
                .create();

        try {
            JSONObject jsonObject = doGet("Collection/"+collection.getId()+"");
            if(jsonObject == null){
                return null;
            }
            JSONObject result = jsonObject.getJSONObject("Result");
            JSONArray jsonWords = result.getJSONArray("Words");

            Log.d(TAG,"result : " + jsonWords);
            for (int i = 0; i < jsonWords.length(); i++) {
                JSONObject collectionJson = jsonWords.getJSONObject(i);
                String jsonString = collectionJson.toString();
                Word word = gson.fromJson(jsonString,Word.class);
                words.add(word);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return words;
    }
}
