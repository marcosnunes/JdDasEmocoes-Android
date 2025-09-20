package com.ojardimdasemocoes;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;

import java.util.UUID;

public class FullscreenActivity extends AppCompatActivity {

    private static final String PREF_DEVICE_ID = "device_id";
    private WebView webView;
    private AlertDialog exitConfirmationDialog;
    private String deviceId;

    @SuppressLint({"SetJavaScriptEnabled"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fullscreen);

        SharedPreferences sharedPref = getPreferences(Context.MODE_PRIVATE);
        deviceId = sharedPref.getString(PREF_DEVICE_ID, null);

        if (deviceId == null) {
            deviceId = UUID.randomUUID().toString();
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putString(PREF_DEVICE_ID, deviceId);
            editor.apply();
            Log.d("FullscreenActivity", "Novo Device ID gerado e salvo: " + deviceId);
        } else {
            Log.d("FullscreenActivity", "Device ID existente carregado: " + deviceId);
        }

        webView = findViewById(R.id.webview);

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        if (hasNetworkConnection()) {
            // Carrega a tela de splash local, passando o deviceId como parâmetro
            String splashUrl = "file:///android_asset/splashScreen.html?deviceId=" + deviceId;
            webView.loadUrl(splashUrl);
        } else {
            showNetworkAlertDialog();
        }

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    exitConfirmationDialog.show();
                }
            }
        });

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("Você tem certeza que deseja sair?");
        builder.setTitle("Sair");
        builder.setPositiveButton("Sim", (dialog, id) -> exitApp());
        builder.setNegativeButton("Não", (dialog, id) -> {
        });
        exitConfirmationDialog = builder.create();
    }

    private void exitApp() {
        webView.clearHistory();
        webView.clearCache(true);
        webView.destroyDrawingCache();
        webView.destroy();
        finishAffinity();
        System.exit(0);
        android.os.Process.killProcess(android.os.Process.myPid());
        Log.d("AppExit", "Application is exiting...");
        moveTaskToBack(true);
        android.os.Process.killProcess(android.os.Process.myPid());
        System.exit(1);
    }

    private void showNetworkAlertDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("Por favor conecte-se à internet!");
        builder.setTitle("Sem conexão de rede");
        builder.setPositiveButton("OK", (dialog, id) -> {
        });
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    @SuppressWarnings("deprecation")
    private boolean hasNetworkConnection() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivityManager == null) {
            return false;
        }
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }
}