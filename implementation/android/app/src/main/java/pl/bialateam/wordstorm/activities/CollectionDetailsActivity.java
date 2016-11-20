package pl.bialateam.wordstorm.activities;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.List;

import pl.bialateam.wordstorm.R;
import pl.bialateam.wordstorm.activities.details.WordListAdapter;
import pl.bialateam.wordstorm.network.CollectionEndpoint;
import pl.bialateam.wordstorm.pojo.Collection;
import pl.bialateam.wordstorm.pojo.Word;

public class CollectionDetailsActivity extends AppCompatActivity {

    WordListAdapter adapter;
    Collection collection = null;

    LoadWordsTask loadWordsTask = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_collection_details);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.start_quiz);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(CollectionDetailsActivity.this,CardGameActivity.class);
                Bundle bundle = new Bundle();
                bundle.putSerializable("words",adapter.getData());
                intent.putExtras(bundle);
                startActivity(intent);
            }
        });

        Bundle b = getIntent().getExtras();
        if(b != null)
            collection = (Collection)b.getSerializable("collection");

        setTitle(collection.getName());

        adapter = new WordListAdapter(this,new ArrayList());
        ListView collectionListView = (ListView) findViewById(R.id.word_list_view);
        collectionListView.setAdapter(adapter);

        refreshWords();
    }

    private void refreshWords() {
        if(loadWordsTask != null){
            return;
        }

        loadWordsTask = new LoadWordsTask();
        loadWordsTask.execute();
    }

    public class LoadWordsTask extends AsyncTask<Void, Void, List<Word>> {

        @Override
        protected List<Word> doInBackground(Void... params) {
            CollectionEndpoint collectionEndpoint = new CollectionEndpoint();
            List<Word> collectionList = collectionEndpoint.getAllWordsForCollection(collection);
            return collectionList;
        }

        @Override
        protected void onPostExecute(List<Word> wordList) {
            adapter.clear();
            adapter.addAll(wordList);
            loadWordsTask = null;
        }
    }
}
