package pl.bialateam.wordstorm.activities;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import pl.bialateam.wordstorm.R;
import pl.bialateam.wordstorm.activities.details.WordListAdapter;
import pl.bialateam.wordstorm.network.CollectionEndpoint;
import pl.bialateam.wordstorm.pojo.Collection;
import pl.bialateam.wordstorm.pojo.Word;


public class CollectionDetailsActivity extends AppCompatActivity {

    ArrayList<Word> words = new ArrayList<>();

    WordListAdapter wordsAdapters[] = new WordListAdapter[10];

    Collection collection = null;

    LoadWordsTask loadWordsTask = null;

    private SectionsPagerAdapter mSectionsPagerAdapter;
    private ViewPager mViewPager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_collection_details);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        setUpTabs();

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.start_quiz);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(CollectionDetailsActivity.this,CardGameActivity.class);
                Bundle bundle = new Bundle();
                bundle.putSerializable("words",words);
                intent.putExtras(bundle);
                startActivity(intent);
            }
        });

        Bundle b = getIntent().getExtras();
        if(b != null)
            collection = (Collection)b.getSerializable("collection");

        setTitle(collection.getName());
        if(toolbar != null){
            toolbar.setTitle(collection.getName());
        }

        for (int i = 0; i < wordsAdapters.length; i++) {
            wordsAdapters[i] = new WordListAdapter(this,new ArrayList());
        }

        refreshWords();
    }

    private void setUpTabs() {
        // Initilization
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager());

        // Set up the ViewPager with the sections adapter.
        mViewPager = (ViewPager) findViewById(R.id.container);
        mViewPager.setAdapter(mSectionsPagerAdapter);

        TabLayout tabLayout = (TabLayout) findViewById(R.id.tab_layout);
        tabLayout.setupWithViewPager(mViewPager);

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
            for (int i = 0; i < wordsAdapters.length; i++) {
                wordsAdapters[i].clear();
            }

            for (Word word : wordList) {
                Log.d("taggg",word.toString());
                wordsAdapters[word.getTier()].add(word);
            }

            words.addAll(wordList);
            loadWordsTask = null;
        }
    }



    public static class PlaceholderFragment extends Fragment {

        private static final String ARG_SECTION_NUMBER = "section_number";
        WordListAdapter wordsAdapter;


        public PlaceholderFragment(WordListAdapter wordsAdapter) {
            this.wordsAdapter = wordsAdapter;
        }

        public static PlaceholderFragment newInstance(int sectionNumber, WordListAdapter wordsAdapter) {
            PlaceholderFragment fragment = new PlaceholderFragment(wordsAdapter);
            Bundle args = new Bundle();
            args.putInt(ARG_SECTION_NUMBER, sectionNumber);
            fragment.setArguments(args);
            return fragment;
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.fragment_temp, container, false);
            ListView collectionListView = (ListView) rootView.findViewById(R.id.word_list_view);
            collectionListView.setAdapter(wordsAdapter);
            return rootView;
        }
    }

    public class SectionsPagerAdapter extends FragmentPagerAdapter {


        public SectionsPagerAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public Fragment getItem(int position) {
            return PlaceholderFragment.newInstance(position + 1,wordsAdapters[position]);
        }

        @Override
        public int getCount() {
            // Show 3 total pages.
            return 6;
        }

        @Override
        public CharSequence getPageTitle(int position) {
            if(position == 5){
                return "Umiem!";
            }
            return String.valueOf(position+1);
        }
    }
}
