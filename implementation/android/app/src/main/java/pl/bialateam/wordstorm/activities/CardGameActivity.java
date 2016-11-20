package pl.bialateam.wordstorm.activities;

import android.annotation.SuppressLint;
import android.app.Fragment;
import android.content.Intent;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import java.util.List;

import pl.bialateam.wordstorm.R;
import pl.bialateam.wordstorm.activities.card.game.OnSwipeTouchListener;
import pl.bialateam.wordstorm.pojo.Word;


public class CardGameActivity extends AppCompatActivity {

    private static final boolean AUTO_HIDE = true;

    boolean translation = false;

    private static final int AUTO_HIDE_DELAY_MILLIS = 3000;

    /**
     * Some older devices needs a small delay between UI widget updates
     * and a change of the status and navigation bar.
     */
    private static final int UI_ANIMATION_DELAY = 300;
    private final Handler mHideHandler = new Handler();
    private View mContentView;
    private final Runnable mHidePart2Runnable = new Runnable() {
        @SuppressLint("InlinedApi")
        @Override
        public void run() {
            // Delayed removal of status and navigation bar

            // Note that some of these constants are new as of API 16 (Jelly Bean)
            // and API 19 (KitKat). It is safe to use them, as they are inlined
            // at compile-time and do nothing on earlier devices.
            mContentView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LOW_PROFILE
                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION);
        }
    };
    private View mControlsView;
    private final Runnable mShowPart2Runnable = new Runnable() {
        @Override
        public void run() {
            // Delayed display of UI elements
            ActionBar actionBar = getSupportActionBar();
            if (actionBar != null) {
                actionBar.show();
            }
            mControlsView.setVisibility(View.VISIBLE);
        }
    };

    private final Runnable mHideRunnable = new Runnable() {
        @Override
        public void run() {
            hide();
        }
    };
    /**
     * Touch listener to use for in-layout UI controls to delay hiding the
     * system UI. This is to prevent the jarring behavior of controls going away
     * while interacting with activity UI.
     */
    private final View.OnTouchListener mDelayHideTouchListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View view, MotionEvent motionEvent) {
            if (AUTO_HIDE) {
                delayedHide(AUTO_HIDE_DELAY_MILLIS);
            }
            return false;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        Bundle bundle = intent.getExtras();
        final List<Word> words = (List<Word>) bundle.getSerializable("words");

        setContentView(R.layout.activity_card_game);

        mControlsView = findViewById(R.id.fullscreen_content_controls);
        mContentView = findViewById(R.id.fragment_container);
        mContentView.setOnTouchListener(new OnSwipeTouchListener(getApplicationContext()) {
            @Override
            public void onSwipeLeft() {
                Fragment cardFragment;
                if(translation){
                    cardFragment = new CardReverseFragment(words.get(0));
                }else{
                    cardFragment = new CardFragment(words.get(0));
                }
                getFragmentManager().beginTransaction()
                        .setCustomAnimations(R.animator.card_flip_right_in,R.animator.card_flip_right_out)
                        .replace(R.id.fragment_container, cardFragment, "fragment")
                        .addToBackStack(null)
                        .commit();
                Toast.makeText(CardGameActivity.this, "Poprzednia fiszka!", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onSwipeRight() {
                Fragment cardFragment;
                if(translation){
                    cardFragment = new CardReverseFragment(words.get(0));
                }else{
                    cardFragment = new CardFragment(words.get(0));
                }

                android.app.FragmentTransaction ft = getFragmentManager().beginTransaction();
                ft.setCustomAnimations(R.animator.card_flip_left_in, R.animator.card_flip_left_out);
                ft.replace(R.id.fragment_container, cardFragment, "fragment");
                ft.addToBackStack(null);
                ft.commit();
                Toast.makeText(CardGameActivity.this, "Nastepna fiszka!", Toast.LENGTH_SHORT).show();
            }
            @Override
            public void onSwipeTop() {
                CardFragment cardFragment = new CardFragment(words.get(0));
                android.app.FragmentTransaction ft = getFragmentManager().beginTransaction();
                ft.setCustomAnimations(R.animator.slide_up, R.animator.slide_down);
                ft.replace(R.id.fragment_container, cardFragment, "fragment");
                ft.addToBackStack(null);
                ft.commit();
                Toast.makeText(CardGameActivity.this, "Tłumaczenie fiszki!", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onSwipeBottom() {
                CardFragment cardFragment = new CardFragment(words.get(0));
                android.app.FragmentTransaction ft = getFragmentManager().beginTransaction();
                ft.setCustomAnimations(R.animator.slide_down_throw, R.animator.slide_up_throw);
                ft.replace(R.id.fragment_container, cardFragment, "fragment");
                ft.addToBackStack(null);
                ft.commit();
                Toast.makeText(CardGameActivity.this, "Nie wiem/Nastepna fiszka!", Toast.LENGTH_SHORT).show();
            }
        });

        CardFragment cardFragment = new CardFragment(words.get(0));
        android.app.FragmentTransaction ft = getFragmentManager().beginTransaction();
        ft.add(R.id.fragment_container, cardFragment, "fragment");
        ft.addToBackStack(null);
        ft.commit();

        findViewById(R.id.dummy_button).setOnTouchListener(mDelayHideTouchListener);
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);

        delayedHide(100);
    }

    private void hide() {
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.hide();
        }
        mControlsView.setVisibility(View.GONE);

        // Schedule a runnable to remove the status and navigation bar after a delay
        mHideHandler.removeCallbacks(mShowPart2Runnable);
        mHideHandler.postDelayed(mHidePart2Runnable, UI_ANIMATION_DELAY);
    }

    /**
     * Schedules a call to hide() in [delay] milliseconds, canceling any
     * previously scheduled calls.
     */
    private void delayedHide(int delayMillis) {
        mHideHandler.removeCallbacks(mHideRunnable);
        mHideHandler.postDelayed(mHideRunnable, delayMillis);
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finish();
    }

    public class CardFragment extends Fragment{

        private Word word;

        CardFragment(Word word){
            this.word = word;
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View v = inflater.inflate(R.layout.fragment_card_translation, container, false);

            TextView wordTextView = (TextView) v.findViewById(R.id.word);
            TextView pronunciationTextView = (TextView) v.findViewById(R.id.pronunciation);
            wordTextView.setText(word.getWord());
            pronunciationTextView.setText("/"+word.getPronunciation()+"/");

            return v;
        }
    }

    public class CardReverseFragment extends Fragment{

        private Word word;

        CardReverseFragment(Word word){
            this.word = word;
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View v = inflater.inflate(R.layout.fragment_card_translation, container, false);

            TextView wordTextView = (TextView) v.findViewById(R.id.word);
            TextView pronunciationTextView = (TextView) v.findViewById(R.id.pronunciation);
            String translation = word.getTranslations().get(0).getTranslation();
            wordTextView.setText(translation);
            pronunciationTextView.setText(word.getPronunciation());

            return v;
        }
    }


}
