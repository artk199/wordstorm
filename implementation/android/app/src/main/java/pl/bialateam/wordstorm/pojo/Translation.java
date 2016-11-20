package pl.bialateam.wordstorm.pojo;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Artur on 16.11.2016.
 */

public class Translation implements Serializable {

    String id;
    String translation;
    List<Sentence> sentences;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTranslation() {
        return translation;
    }

    public void setTranslation(String translation) {
        this.translation = translation;
    }

    public List<Sentence> getSentences() {
        return sentences;
    }

    public void setSentences(List<Sentence> sentences) {
        this.sentences = sentences;
    }
}
