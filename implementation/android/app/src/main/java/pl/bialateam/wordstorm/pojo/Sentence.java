package pl.bialateam.wordstorm.pojo;

import java.io.Serializable;

/**
 * Created by Artur on 03.11.2016.
 */

public class Sentence implements Serializable {

    String id;
    String origin;
    String translation;
    //TODO: Czy to na perno obiekt Word?
    Word userWord;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getTranslation() {
        return translation;
    }

    public void setTranslation(String translation) {
        this.translation = translation;
    }

    public Word getUserWord() {
        return userWord;
    }

    public void setUserWord(Word userWord) {
        this.userWord = userWord;
    }
}
