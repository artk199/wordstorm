package pl.bialateam.wordstorm.pojo;

import java.util.Date;
import java.util.List;

/**
 * Created by Artur on 03.11.2016.
 */

public class Word {

    String id;
    String transcription;
    String word;
    int partOfSpeech;
    int inflection;
    int difficultyLevel;
    boolean dictionaryStatus;
    int tier;
    boolean isKnown;
    Date creationDateTime;
    List<Sentence> sentences;
    //TODO: Czy to napewno obiekt baseWord;
    Word baseWord;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public String getTranscription() {
        return transcription;
    }

    public void setTranscription(String transcription) {
        this.transcription = transcription;
    }

    public int getPartOfSpeech() {
        return partOfSpeech;
    }

    public void setPartOfSpeech(int partOfSpeech) {
        this.partOfSpeech = partOfSpeech;
    }

    public int getInflection() {
        return inflection;
    }

    public void setInflection(int inflection) {
        this.inflection = inflection;
    }

    public int getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(int difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public boolean isDictionaryStatus() {
        return dictionaryStatus;
    }

    public void setDictionaryStatus(boolean dictionaryStatus) {
        this.dictionaryStatus = dictionaryStatus;
    }

    public int getTier() {
        return tier;
    }

    public void setTier(int tier) {
        this.tier = tier;
    }

    public boolean isKnown() {
        return isKnown;
    }

    public void setKnown(boolean known) {
        isKnown = known;
    }

    public Date getCreationDateTime() {
        return creationDateTime;
    }

    public void setCreationDateTime(Date creationDateTime) {
        this.creationDateTime = creationDateTime;
    }

    public List<Sentence> getSentences() {
        return sentences;
    }

    public void setSentences(List<Sentence> sentences) {
        this.sentences = sentences;
    }

    public Word getBaseWord() {
        return baseWord;
    }

    public void setBaseWord(Word baseWord) {
        this.baseWord = baseWord;
    }
}
