package pl.bialateam.wordstorm.activities;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.app.ActionBar;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;

import android.os.AsyncTask;

import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Response;
import com.android.volley.VolleyError;

import org.json.JSONException;
import org.json.JSONObject;

import pl.bialateam.wordstorm.R;
import pl.bialateam.wordstorm.authentication.Authentication;
import pl.bialateam.wordstorm.authentication.AuthenticationProvider;
import pl.bialateam.wordstorm.network.auth.LoginRequest;

/**
 * A login screen that offers login via email/password.
 */
public class LoginActivity extends AppCompatActivity{

    /**
     * Keep track of the login task to ensure we can cancel it if requested.
     */
    private boolean mAuthTask = false;

    // UI references.
    private EditText mLoginView;
    private EditText mPasswordView;
    private View mProgressView;
    private View mLoginFormView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        getSupportActionBar().hide();


        // Set up the login form.
        mLoginView = (EditText) findViewById(R.id.loginText);
        mPasswordView = (EditText) findViewById(R.id.password);

        Button mEmailSignInButton = (Button) findViewById(R.id.email_sign_in_button);
        mEmailSignInButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                attemptLogin();
            }
        });

        TextView registerLink = (TextView) findViewById(R.id.register_link);
        registerLink.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent loginActivity = new Intent(LoginActivity.this,RegisterActivity.class);
                LoginActivity.this.startActivity(loginActivity);
            }
        });

        mLoginFormView = findViewById(R.id.login_form);
        mProgressView = findViewById(R.id.login_progress);

        //TODO: Remove this
        mLoginView.setText("a@a.a");
        mPasswordView.setText("a");
        //attemptLogin();

        SharedPreferences sharedPref = getSharedPreferences(
                getString(R.string.preference_file_key), Context.MODE_PRIVATE);
        if(sharedPref.contains("username")){
            showProgress(true);
            String username = sharedPref.getString("username","username");
            String token = sharedPref.getString("token","token");
            Authentication authentication = new Authentication();
            authentication.setUsername(username);
            authentication.setToken(token);
            StormApplication.setAuthentication(authentication);
            switchActivity();
            finish();
        }

    }

    private void attemptLogin() {
        if (mAuthTask) {
            return;
        }

        // Reset errors.
        mLoginView.setError(null);
        mPasswordView.setError(null);

        // Store values at the time of the login attempt.
        String email = mLoginView.getText().toString();
        String password = mPasswordView.getText().toString();

        boolean cancel = false;
        View focusView = null;

        // Check for a valid password, if the user entered one.
        if (TextUtils.isEmpty(password)) {
            mPasswordView.setError(getString(R.string.error_invalid_password));
            focusView = mPasswordView;
            cancel = true;
        }

        // Check for a valid email address.
        if (TextUtils.isEmpty(email)) {
            mLoginView.setError(getString(R.string.error_field_required));
            focusView = mLoginView;
            cancel = true;
        }

        if (cancel) {
            // There was an error; don't attempt login and focus the first
            // form field with an error.
            focusView.requestFocus();
        } else {
            // Show a progress spinner, and kick off a background task to
            // perform the user login attempt.
            showProgress(true);
            startLoginRequest(email,password);
        }
    }

    /**
     * Shows the progress UI and hides the login form.
     */
    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
    private void showProgress(final boolean show) {
        // On Honeycomb MR2 we have the ViewPropertyAnimator APIs, which allow
        // for very easy animations. If available, use these APIs to fade-in
        // the progress spinner.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
            int shortAnimTime = getResources().getInteger(android.R.integer.config_shortAnimTime);

            mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
            mLoginFormView.animate().setDuration(shortAnimTime).alpha(
                    show ? 0 : 1).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
                }
            });

            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
            mProgressView.animate().setDuration(shortAnimTime).alpha(
                    show ? 1 : 0).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
                }
            });
        } else {
            // The ViewPropertyAnimator APIs are not available, so simply show
            // and hide the relevant UI components.
            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
            mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
        }
    }

    private void switchActivity(){
        Intent startActivity = new Intent(LoginActivity.this,StartActivity.class);
        LoginActivity.this.startActivity(startActivity);
    }


    private void startLoginRequest(final String login, String password){
        mAuthTask = true;
        LoginRequest.createRequest(login, password, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                //TODO: Stworzyć z tego generyka i zeby zwracał Authentication a nie JsonObject
                if(response == null){
                    showToastError();
                    return;
                }
                Authentication authentication = new Authentication();
                try {
                    JSONObject result = null;
                    result = response.getJSONObject("Result");
                    authentication.setUsername(login);
                    authentication.setToken(result.getString("access_token"));
                } catch (JSONException e) {
                    e.printStackTrace();
                    showToastError();
                    return;
                }
                mAuthTask = false;
                showProgress(false);
                AuthenticationProvider authenticationProvider = new AuthenticationProvider();
                authenticationProvider.authenticate(authentication);
                switchActivity();
                SharedPreferences sharedPref = getSharedPreferences(
                        getString(R.string.preference_file_key), Context.MODE_PRIVATE);
                sharedPref.edit()
                        .putString("username",StormApplication.getAuthentication().getUsername())
                        .putString("token",StormApplication.getAuthentication().getToken())
                        .commit();
                finish();

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                //TODO: Wypisywac bledy normalnie a nie tostem
                showToastError();
                mAuthTask = false;
                showProgress(false);
            }
        });
    }

    private void showToastError() {
        Toast.makeText(LoginActivity.this, "Nienznany błąd podczas logowania.", Toast.LENGTH_LONG).show();
    }
}

