package pl.bialateam.wordstorm.activities.details;

import android.app.Activity;
import android.content.Context;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import pl.bialateam.wordstorm.R;
import pl.bialateam.wordstorm.pojo.Collection;
import pl.bialateam.wordstorm.pojo.Word;

/**
 * Created by Artur on 11.11.2016.
 */

public class WordListAdapter extends ArrayAdapter<Word> {

    Context context;
    int resource;
    private ArrayList<Word> data = null;

    public WordListAdapter(Context context, ArrayList objects) {
        super(context, R.layout.word_row, objects);
        this.context = context;
        this.resource = R.layout.word_row;
        this.data = objects;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View view = convertView;
        WordHolder collectionHolder = null;
        if(view == null){
            LayoutInflater inflater = ((Activity) context).getLayoutInflater();
            view = inflater.inflate(resource,parent,false);
            collectionHolder = new WordHolder();
            collectionHolder.image = (ImageView) view.findViewById(R.id.collection_image);
            collectionHolder.title = (TextView) view.findViewById(R.id.word_title);

            view.setTag(collectionHolder);
        }else{
            collectionHolder = (WordHolder) view.getTag();
        }

        Word collection = data.get(position);
        collectionHolder.title.setText(collection.getWord());

        return view;
    }

    public ArrayList<Word> getData() {
        return data;
    }

    public void setData(ArrayList<Word> data) {
        this.data = data;
    }

    class WordHolder{

        ImageView image;
        TextView title;

    }
}
