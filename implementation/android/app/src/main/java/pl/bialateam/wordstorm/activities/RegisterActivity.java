package pl.bialateam.wordstorm.activities;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.android.volley.NetworkResponse;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.google.gson.JsonObject;

import org.json.JSONObject;

import pl.bialateam.wordstorm.R;
import pl.bialateam.wordstorm.authentication.AuthenticationProvider;
import pl.bialateam.wordstorm.network.RegisterRequest;

public class RegisterActivity extends AppCompatActivity {

    private boolean userRegisterTask = false;

    // UI references.
    private EditText mRegisterLoginView;
    private EditText mRegisterPasswordView;
    private EditText mRegisterRepeatPasswordView;
    private View mProgressView;
    private View mRegisterFormView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        getSupportActionBar().hide();

        mRegisterLoginView = (EditText) findViewById(R.id.registerLoginText);
        mRegisterPasswordView = (EditText) findViewById(R.id.registerPassword);
        mRegisterRepeatPasswordView = (EditText) findViewById(R.id.registerRepeatPassword);

        mProgressView = findViewById(R.id.register_progress);
        mRegisterFormView = findViewById(R.id.register_form);

        Button registerButton = (Button) findViewById(R.id.registerButton);
        registerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                attemptRegister();
            }
        });
    }

    private void attemptRegister() {
        if(userRegisterTask)
            return;

        String login  = mRegisterLoginView.getText().toString();
        String password = mRegisterPasswordView.getText().toString();
        String repeatedPassword = mRegisterRepeatPasswordView.getText().toString();

        boolean cancel = false;
        View focusView = null;

        if (TextUtils.isEmpty(password)) {
            mRegisterPasswordView.setError(getString(R.string.error_field_required));
            focusView = mRegisterPasswordView;
            cancel = true;
        }

        if (TextUtils.isEmpty(login)) {
            mRegisterLoginView.setError(getString(R.string.error_field_required));
            focusView = mRegisterLoginView;
            cancel = true;
        }

        if (!TextUtils.equals(password,repeatedPassword)) {
            mRegisterRepeatPasswordView.setError(getString(R.string.error_password_mismatch));
            focusView = mRegisterRepeatPasswordView;
            cancel = true;
        }

        if(cancel){
            focusView.requestFocus();
            return;
        }

        showProgress(true);
        registerRequest(login,password);
        userRegisterTask = true;
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

            mRegisterFormView.setVisibility(show ? View.GONE : View.VISIBLE);
            mRegisterFormView.animate().setDuration(shortAnimTime).alpha(
                    show ? 0 : 1).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    mRegisterFormView.setVisibility(show ? View.GONE : View.VISIBLE);
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
            mRegisterFormView.setVisibility(show ? View.GONE : View.VISIBLE);
        }
    }


    private void registerRequest(final String username, final String password) {


        RegisterRequest stringRequest = RegisterRequest.createRequest(username, password, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                AuthenticationProvider authenticationProvider = new AuthenticationProvider();
                showProgress(false);
                CharSequence text = "Poprawna rejestracja, możesz się teraz zalogować.";
                int duration = Toast.LENGTH_SHORT;

                Toast toast = Toast.makeText(RegisterActivity.this, text, duration);
                toast.show();
                switchActivity();
                finish();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("Volly Error", error.toString());

                NetworkResponse networkResponse = error.networkResponse;
                if (networkResponse != null) {
                    Log.e("Status code", String.valueOf(networkResponse.statusCode));
                    mRegisterLoginView.setError("Bład podczas rejestracji.");
                }
                userRegisterTask = false;
                showProgress(false);
            }
        });

        StormApplication.getRequestQueue().add(stringRequest);

        return;
    }

    private void switchActivity(){
        Intent startActivity = new Intent(RegisterActivity.this,LoginActivity.class);
        RegisterActivity.this.startActivity(startActivity);
    }

}
