package pl.bialateam.wordstorm.pojo;

import java.io.Serializable;

/**
 * Created by Artur on 03.11.2016.
 */

public class Collection implements Serializable {

    String id;
    String name;
    boolean isPublic;
    int difficultLevel;
    Category category;
    int totalWords;
    int totalKnownWords;

    public int getTotalWords() {
        return totalWords;
    }

    public void setTotalWords(int totalWords) {
        this.totalWords = totalWords;
    }

    public int getTotalKnownWords() {
        return totalKnownWords;
    }

    public void setTotalKnownWords(int totalKnownWords) {
        this.totalKnownWords = totalKnownWords;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public int getDifficultLevel() {
        return difficultLevel;
    }

    public void setDifficultLevel(int difficultLevel) {
        this.difficultLevel = difficultLevel;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
