package pl.bialateam.wordstorm.activities.start;

import android.app.Activity;
import android.content.Context;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.List;

import pl.bialateam.wordstorm.R;
import pl.bialateam.wordstorm.pojo.Collection;

/**
 * Created by Artur on 11.11.2016.
 */

public class CollectionListAdapter extends ArrayAdapter<Collection> {

    Context context;
    int resource;
    List<Collection> data = null;

    //TODO: Przerobic ten konstruktor aby przyjmował tylko context oraz List<Collection>
    public CollectionListAdapter(Context context, List objects) {
        super(context, R.layout.collection_row, objects);
        this.context = context;
        this.resource = R.layout.collection_row;
        this.data = objects;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View view = convertView;
        CollectionHolder collectionHolder = null;
        if(view == null){
            LayoutInflater inflater = ((Activity) context).getLayoutInflater();
            view = inflater.inflate(resource,parent,false);
            collectionHolder = new CollectionHolder();
            collectionHolder.image = (ImageView) view.findViewById(R.id.collection_image);
            collectionHolder.title = (TextView) view.findViewById(R.id.collection_title);

            view.setTag(collectionHolder);
        }else{
            collectionHolder = (CollectionHolder) view.getTag();
        }

        Collection collection = data.get(position);
        collectionHolder.title.setText(collection.getName());

        return view;
    }

    class CollectionHolder{

        ImageView image;
        TextView title;

    }
}
