package pl.bialateam.wordstorm;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.os.AsyncTask;
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import pl.bialateam.wordstorm.authentication.AuthenticationProvider;

public class RegisterActivity extends AppCompatActivity {

    private UserRegisterTask userRegisterTask = null;

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
        if(userRegisterTask != null)
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
        this.userRegisterTask = new UserRegisterTask(login, password);
        userRegisterTask.doInBackground();

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

    public class UserRegisterTask extends AsyncTask<Void, Void, Boolean> {

        String login;
        String password;

        UserRegisterTask(String login,String password){
            this.login = login;
            this.password = password;
        }

        @Override
        protected Boolean doInBackground(Void... params) {
            AuthenticationProvider authenticationProvider = new AuthenticationProvider();
            return authenticationProvider.registerAndAuthenticate(login,password);
        }

        @Override
        protected void onPostExecute(Boolean aBoolean) {
            userRegisterTask = null;
            showProgress(false);
        }
    }
}
