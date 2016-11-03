package pl.bialateam.wordstorm.authentication;

/**
 * Authentication object used in application to define logged in user.
 * Created by Artur on 03.11.2016.
 */
public class Authentication {

    private String username;
    private String token;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
