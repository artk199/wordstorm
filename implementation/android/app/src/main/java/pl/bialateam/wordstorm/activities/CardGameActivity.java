package pl.bialateam.wordstorm.activities;

import android.app.Fragment;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.SeekBar;
import android.widget.TextView;

import java.util.Collection;
import java.util.List;

import pl.bialateam.wordstorm.R;
import pl.bialateam.wordstorm.activities.card.game.OnSwipeTouchListener;
import pl.bialateam.wordstorm.cardgame.CardGame;
import pl.bialateam.wordstorm.pojo.Translation;
import pl.bialateam.wordstorm.pojo.Word;


public class CardGameActivity extends AppCompatActivity {

    private CardGame cardGame;


    private View mContentView;
    private SeekBar mSeekBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_NOSENSOR);
        Intent intent = getIntent();
        Bundle bundle = intent.getExtras();
        final List<Word> words = (List<Word>) bundle.getSerializable("words");

        this.cardGame = new CardGame(words);

        setContentView(R.layout.activity_card_game);

        mSeekBar = (SeekBar) findViewById(R.id.card_game_progress);
        mSeekBar.setOnTouchListener(new View.OnTouchListener(){
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                return true;
            }
        });
        mSeekBar.setMax(words.size());

        mContentView = findViewById(R.id.fragment_container);
        mContentView.setOnTouchListener(new OnSwipeTouchListener(getApplicationContext()) {
            @Override
            public void onSwipeLeft() {
                cardGame.flipWord();
                changeCardFragmentWithAnimation(R.animator.card_flip_right_in,R.animator.card_flip_right_out);
            }

            @Override
            public void onSwipeRight() {
                cardGame.flipWord();
                changeCardFragmentWithAnimation(R.animator.card_flip_left_in,R.animator.card_flip_left_out);
            }
            @Override
            public void onSwipeTop() {
                cardGame.setToKnown();
                mSeekBar.setProgress(mSeekBar.getProgress()+1);
                changeCardFragmentWithAnimation(R.animator.slide_up,R.animator.slide_down);
            }

            @Override
            public void onSwipeBottom() {
                cardGame.setToNotKnown();
                mSeekBar.setProgress(mSeekBar.getProgress()+1);
                changeCardFragmentWithAnimation(R.animator.slide_down_throw,R.animator.slide_up_throw);
            }
        });

        Fragment cardFragment = getCardFragment();
        android.app.FragmentTransaction ft = getFragmentManager().beginTransaction();
        ft.add(R.id.fragment_container, cardFragment, "fragment");
        ft.addToBackStack(null);
        ft.commit();

    }

    private void changeCardFragmentWithAnimation(int anim1, int anim2) {
        Fragment cardFragment = getCardFragment();
        if(cardFragment == null){
            return;
        }
        getFragmentManager().beginTransaction()
                .setCustomAnimations(anim1, anim2)
                .replace(R.id.fragment_container, cardFragment, "fragment")
                .addToBackStack(null)
                .commit();
    }

    private Fragment getCardFragment() {
        if(cardGame.getCurrentWord() == null){
            finish();
            return null;
        }
        Fragment fragment;
        if(cardGame.isTranslated()){
            fragment = new CardReverseFragment(cardGame.getCurrentWord());
        }else{
            fragment = new CardFragment(cardGame.getCurrentWord());
        }
        return fragment;
    }

    private void hide() {
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.hide();
        }
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
            View v = inflater.inflate(R.layout.fragment_card, container, false);

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

            List<Translation> translations = word.getTranslations();
            for (int i = 0; i < translations.size(); i++) {
                if(i==0) {
                    Translation translation = translations.get(0);
                    TranslationFragment translationFragment = new TranslationFragment(translation);
                    CardReverseFragment.this.getChildFragmentManager().beginTransaction()
                            .add(R.id.translation_fragment_container, translationFragment, "translationFragment")
                            .addToBackStack(null)
                            .commit();
                }
            }


            return v;
        }
    }

    public class TranslationFragment extends Fragment{

        private Translation translation;

        TranslationFragment(Translation translation){
            this.translation = translation;
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View v = inflater.inflate(R.layout.translation_fragment, container, false);

            TextView translationText = (TextView) v.findViewById(R.id.translation_text);
            TextView translationType = (TextView) v.findViewById(R.id.translation_type);
            translationText.setText(translation.getTranslation());
            translationType.setText("");

            return v;
        }
    }


}
