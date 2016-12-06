package pl.bialateam.wordstorm.cardgame;

import java.util.List;

import pl.bialateam.wordstorm.network.WordEndpoint;
import pl.bialateam.wordstorm.pojo.Word;

/**
 * Created by Artur on 24.11.2016.
 */

public class CardGame {

    private List<Word> words;
    private boolean translated = false;
    private int index = 0;
    private int known = 0;
    private int notKnown = 0;

    public CardGame(List<Word> words){
        this.words = words;
    }

    public Word getCurrentWord(){
        if(index >= words.size())
            return null;
        return words.get(index);
    }

    public void flipWord(){
        translated = !translated;
    }

    public void setToKnown(){
        WordEndpoint.getInstance().setWordToKnown(getCurrentWord(),true);
        known++;
        nextWord();
    }

    public void setToNotKnown(){
        WordEndpoint.getInstance().setWordToKnown(getCurrentWord(),false);
        notKnown++;
        nextWord();
    }

    public int getKnown() {
        return known;
    }

    public int getNotKnown() {
        return notKnown;
    }


    private void nextWord(){
        index++;
        translated = false;
    }

    public boolean isTranslated() {
        return translated;
    }
}
