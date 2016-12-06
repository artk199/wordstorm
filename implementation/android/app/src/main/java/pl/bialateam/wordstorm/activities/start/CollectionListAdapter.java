package pl.bialateam.wordstorm.activities.start;

import android.app.Activity;
import android.content.Context;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Filter;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import pl.bialateam.wordstorm.R;
import pl.bialateam.wordstorm.pojo.Collection;

/**
 * Created by Artur on 11.11.2016.
 */

public class CollectionListAdapter extends ArrayAdapter<Collection> {

    Context context;
    int resource;
    List<Collection> data = null;
    List<Collection> originalData = null;
    private CollectionFilter collectionFilter = new CollectionFilter();


    public CollectionListAdapter(Context context, List objects) {
        super(context, R.layout.collection_row, objects);
        this.context = context;
        this.resource = R.layout.collection_row;
        this.data = objects;
        this.originalData = objects;
    }

    public int getCount() {
        return data.size();
    }

    public Collection getItem(int position) {
        return data.get(position);
    }

    public long getItemId(int position) {
        return position;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View view = convertView;
        CollectionHolder collectionHolder = null;
        if (view == null) {
            LayoutInflater inflater = ((Activity) context).getLayoutInflater();
            view = inflater.inflate(resource, parent, false);
            collectionHolder = new CollectionHolder();
            collectionHolder.image = (ImageView) view.findViewById(R.id.collection_image);
            collectionHolder.title = (TextView) view.findViewById(R.id.collection_title);
            collectionHolder.count = (TextView) view.findViewById(R.id.collection_count_know_words);
            collectionHolder.totalCount = (TextView) view.findViewById(R.id.collection_count_all_words);
            view.setTag(collectionHolder);
        } else {
            collectionHolder = (CollectionHolder) view.getTag();
        }
        if(position >= data.size()){
            return view;
        }
        Collection collection = data.get(position);
        collectionHolder.title.setText(collection.getName());
        Random rnd = new Random();
        int random = rnd.nextInt(3);
        int drawable = R.drawable.stick3;
        switch (random){
        case 0:
            drawable = R.drawable.stick3;
            break;
        case 1:
            drawable = R.drawable.stock0;
            break;
        case 2:
            drawable = R.drawable.stock1;
            break;
        }
        collectionHolder.image.setImageResource(drawable);
        collectionHolder.totalCount.setText("/"+String.valueOf(rnd.nextInt(20)+10));
        collectionHolder.count.setText(String.valueOf(rnd.nextInt(10)));
        return view;
    }

    @NonNull
    @Override
    public Filter getFilter() {
        return collectionFilter;
    }

    class CollectionHolder{

        ImageView image;
        TextView title;
        TextView count;
        TextView totalCount;

    }

    private class CollectionFilter extends Filter {

        @Override
        protected FilterResults performFiltering(CharSequence constraint) {

            String filterString = constraint.toString().toLowerCase();

            FilterResults results = new FilterResults();

            final List<Collection> list = originalData;

            int count = list.size();
            final List<Collection> nlist = new ArrayList<>(count);

            Collection filterableCollection;

            for (int i = 0; i < count; i++) {
                filterableCollection = list.get(i);
                if (filterableCollection.getName().contains(filterString)) {
                    nlist.add(filterableCollection);
                }
            }

            results.values = nlist;
            results.count = nlist.size();

            return results;
        }

        @SuppressWarnings("unchecked")
        @Override
        protected void publishResults(CharSequence constraint, FilterResults results) {
            data = (ArrayList<Collection>) results.values;
            notifyDataSetChanged();
        }
    }
}
