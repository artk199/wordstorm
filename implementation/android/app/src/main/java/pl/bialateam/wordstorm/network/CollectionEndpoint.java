package pl.bialateam.wordstorm.network;

import java.util.ArrayList;
import java.util.List;

import pl.bialateam.wordstorm.pojo.Collection;

/**
 * Created by Artur on 11.11.2016.
 */

public class CollectionEndpoint extends Endpoint {

    //TODO: Implement method.
    public List<Collection> getAllCollections() {
        ArrayList<Collection> collections = new ArrayList<>();
        collections.add(new Collection());
        collections.add(new Collection());
        collections.add(new Collection());
        return collections;
    }
}
