package pl.bialateam.wordstorm.activities;

import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.view.MenuItemCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.SearchView;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import pl.bialateam.wordstorm.R;
import pl.bialateam.wordstorm.activities.start.CollectionListAdapter;
import pl.bialateam.wordstorm.authentication.Authentication;
import pl.bialateam.wordstorm.network.CollectionEndpoint;
import pl.bialateam.wordstorm.pojo.Collection;

public class StartActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener, SearchView.OnQueryTextListener {

    TextView usernameTextView;
    TextView emailTextView;
    SwipeRefreshLayout swipeRefreshLayout;
    CollectionListAdapter adapter;
    LoadCollectionsTask loadCollectionsTask = null;

    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_start);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        setTitle("Word Storm");

        /**
        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Tutaj będzie przycisk dodawania swoich kolekcji.", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });
         **/

        adapter = new CollectionListAdapter(this,new ArrayList());
        ListView collectionListView = (ListView) findViewById(R.id.collection_list_view);
        collectionListView.setAdapter(adapter);
        collectionListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {

            @Override
            public void onItemClick(AdapterView<?> arg0, View arg1, int position, long arg3) {
                Intent intent = new Intent(StartActivity.this,CollectionDetailsActivity.class);
                Collection o = adapter.getItem(position);
                Bundle b = new Bundle();
                b.putSerializable("collection", o);
                intent.putExtras(b);
                startActivity(intent);
            }
        });
        swipeRefreshLayout = (SwipeRefreshLayout) findViewById(R.id.content_start);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
                                                    @Override
                                                    public void onRefresh() {
                                                        refreshCollections();
                                                    }
                                                });

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.addDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);
        View header = navigationView.getHeaderView(0);
        usernameTextView = (TextView) header.findViewById(R.id.expanded_menu_username);
        emailTextView = (TextView) header.findViewById(R.id.expanded_menu_email);

        refreshCollections();
    }


    private void refreshCollections(){
        if(loadCollectionsTask != null){
            return;
        }

        loadCollectionsTask = new LoadCollectionsTask();
        loadCollectionsTask.execute();

    }

    @Override
    public void onResume(){
        super.onResume();
        Authentication authentication = StormApplication.getAuthentication();
        if(authentication != null) {
            //TODO: Poustawiac inne pola i moze dodac zdjecie.
            emailTextView.setText(authentication.getUsername());
            usernameTextView.setText(authentication.getUsername());
        }
    }


    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.start, menu);

        // Retrieve the SearchView and plug it into SearchManager
        final SearchView searchView = (SearchView) MenuItemCompat.getActionView(menu.findItem(R.id.action_search));
        SearchManager searchManager = (SearchManager) getSystemService(SEARCH_SERVICE);
        searchView.setSearchableInfo(searchManager.getSearchableInfo(getComponentName()));
        searchView.setSubmitButtonEnabled(true);
        searchView.setOnQueryTextListener(this);

        return true;
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        if (id == R.id.nav_logout) {
            StormApplication.setAuthentication(null);
            SharedPreferences sharedPref = getSharedPreferences(
                    getString(R.string.preference_file_key), Context.MODE_PRIVATE);
            sharedPref.edit().remove("username").commit();
            Intent startActivity = new Intent(StartActivity.this,LoginActivity.class);
            StartActivity.this.startActivity(startActivity);
            finish();
        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

    @Override
    public boolean onQueryTextSubmit(String query) {
        adapter.getFilter().filter(query);
        return true;
    }

    @Override
    public boolean onQueryTextChange(String newText) {
        adapter.getFilter().filter(newText);
        return true;
    }

    /**
     * Represents an asynchronous login/registration task used to authenticate
     * the user.
     */
    public class LoadCollectionsTask extends AsyncTask<Void, Void, List<Collection>> {

        @Override
        protected void onPreExecute() {
            swipeRefreshLayout.setRefreshing(true);
        }

        @Override
        protected List<Collection> doInBackground(Void... params) {
            CollectionEndpoint collectionEndpoint = new CollectionEndpoint();
            List<Collection> collectionList = collectionEndpoint.getAllCollections();
            return collectionList;
        }

        @Override
        protected void onPostExecute(List<Collection> collectionList) {
            if(collectionList!=null) {
                adapter.clear();
                adapter.addAll(collectionList);
            }
            swipeRefreshLayout.setRefreshing(false);
            loadCollectionsTask = null;
        }
    }
}
