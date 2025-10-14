package com.ojardimdasemocoes;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.webkit.WebViewAssetLoader;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.util.Objects;

public class FullscreenActivity extends AppCompatActivity {

    private static final String PREF_FIREBASE_UID = "firebase_uid";
    private WebView webView;
    private AlertDialog exitConfirmationDialog;
    private String firebaseUid;
    private FirebaseAuth mAuth;

    @SuppressLint({"SetJavaScriptEnabled"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowInsetsControllerCompat insetsController =
                WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());

        insetsController.setAppearanceLightStatusBars(true);
        insetsController.setAppearanceLightNavigationBars(true);

        setContentView(R.layout.activity_fullscreen);

        webView = findViewById(R.id.webview);

        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .addPathHandler("/res/", new WebViewAssetLoader.ResourcesPathHandler(this))
                .setDomain("appassets.androidplatform.net")
                .build();

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);
        webSettings.setAllowFileAccess(false);
        webSettings.setAllowContentAccess(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();

                if ((url.startsWith("http://") || url.startsWith("https://")) && !request.getUrl().getHost().equals("appassets.androidplatform.net")) {

                    android.content.Intent intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, request.getUrl());
                    startActivity(intent);

                    return true;
                }

                return false;
            }


            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                Log.e("WebViewError", "Error: " + description + " at URL: " + failingUrl);
            }
        });

        mAuth = FirebaseAuth.getInstance();
        authenticateUser();

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                webView.evaluateJavascript("game.handleBackPress();", value -> {
                    if ("false".equals(value)) {
                        showExitConfirmationDialog();
                    }
                });
            }
        });
    }

    private void authenticateUser() {
        if (!hasNetworkConnection()) {
            showErrorAndExit("Sem conexão com a internet. Por favor, conecte-se e reinicie o aplicativo.");
            return;
        }

        firebaseUid = getSharedPreferences().getString(PREF_FIREBASE_UID, null);

        final String baseUrl = "https://appassets.androidplatform.net/assets/main.html";

        if (firebaseUid == null) {
            mAuth.signInAnonymously().addOnCompleteListener(this, task -> {
                if (task.isSuccessful()) {
                    FirebaseUser user = mAuth.getCurrentUser();
                    if (user != null) {
                        firebaseUid = user.getUid();
                        getSharedPreferences().edit().putString(PREF_FIREBASE_UID, firebaseUid).apply();
                        Log.d("Firebase", "UID gerado: " + firebaseUid);
                        // Carrega a URL HTTPS virtual com o UID
                        webView.loadUrl(baseUrl + "?uid=" + firebaseUid);
                    } else {
                        showErrorAndExit("Falha ao obter o UID do usuário. Reinicie o aplicativo.");
                    }
                } else {
                    Log.e("Firebase", "Falha na autenticação Firebase: " + Objects.requireNonNull(task.getException()).getMessage());
                    showErrorAndExit("Falha ao autenticar com o Firebase. Por favor, reinicie o aplicativo.");
                }
            });
        } else {
            Log.d("Firebase", "UID encontrado: " + firebaseUid);
            webView.loadUrl(baseUrl + "?uid=" + firebaseUid);
        }
    }

    private SharedPreferences getSharedPreferences() {
        return getSharedPreferences("app_prefs", MODE_PRIVATE);
    }

    private void showExitConfirmationDialog() {
        if (exitConfirmationDialog != null && exitConfirmationDialog.isShowing()) {
            return;
        }
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Sair do Aplicativo")
                .setMessage("Você tem certeza que deseja sair?")
                .setPositiveButton("Sim", (dialog, id) -> {
                    // ADICIONE ESTA LINHA PARA PAUSAR A MÚSICA NA WEBVIEW
                    webView.evaluateJavascript("var music = document.getElementById('bgMusic'); if (music) { music.pause(); } localStorage.setItem('bgMusicState', 'paused');", null);
                    finish();
                })
                .setNegativeButton("Não", (dialog, id) -> dialog.dismiss());
        exitConfirmationDialog = builder.create();
        exitConfirmationDialog.show();
    }

    private void showErrorAndExit(String message) {
        if (isFinishing() || isDestroyed()) {
            return;
        }
        new AlertDialog.Builder(this)
                .setTitle("Erro")
                .setMessage(message)
                .setPositiveButton("OK", (dialog, id) -> finish())
                .setCancelable(false)
                .show();
    }

    private boolean hasNetworkConnection() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivityManager == null) {
            return false;
        }
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }
}