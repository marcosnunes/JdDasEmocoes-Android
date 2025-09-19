package com.ojardimdasemocoes;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;

import java.io.File;
import java.util.Objects;
import java.util.UUID;

public class FullscreenActivity extends AppCompatActivity {

    private WebView webView;
    private String webUrl;
    private AlertDialog exitConfirmationDialog;

    // NOVO: Variável para armazenar o ID único do dispositivo
    private String deviceId;

    private static boolean deleteDir(File dir) {
        if (dir != null && dir.isDirectory()) {
            String[] children = dir.list();
            for (String child : Objects.requireNonNull(children)) {
                boolean success = deleteDir(new File(dir, child));
                if (!success) {
                    return false;
                }
            }
        }
        assert dir != null;
        return dir.delete();
    }

    @SuppressLint({"SetJavaScriptEnabled"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fullscreen);

        webUrl = getString(R.string.web_url);
        webView = findViewById(R.id.webview);

        webView.setVisibility(View.GONE);

        // NOVO: Chamar o método para obter ou gerar o ID do dispositivo
        deviceId = getDeviceId(this);

        loadWebContent();

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (exitConfirmationDialog != null && exitConfirmationDialog.isShowing()) {
                    exitConfirmationDialog.dismiss();
                } else {
                    showExitConfirmationDialog();
                }
            }
        });
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void loadWebContent() {
        if (!hasNetworkConnection()) {
            showNetworkAlertDialog();
            return;
        }

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                webView.setVisibility(View.VISIBLE);
                // Injete o ID do dispositivo no JavaScript E CHAME A FUNÇÃO DE INICIALIZAÇÃO.
                // Isso garante que o JS esteja carregado e a função 'initializeAppWithDeviceId' exista.
                view.evaluateJavascript("javascript:window.deviceId = '" + deviceId + "';" +
                        "if (typeof window.initializeAppWithDeviceId === 'function') {" +
                        "  window.initializeAppWithDeviceId('" + deviceId + "');" +
                        "}", null);
            }
        });

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);

        if (hasNetworkConnection()) {
            webView.clearCache(true);
            webView.loadUrl(webUrl);
        } else {
            showNetworkAlertDialog();
        }
    }

    // Metodo para obter ou gerar o ID do dispositivo
    private String getDeviceId(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("JardimDasEmocoesPrefs", Context.MODE_PRIVATE);
        String id = prefs.getString("deviceId", null);
        if (id == null) {
            // Gera um ID único se não existir
            id = UUID.randomUUID().toString();
            // Salva o ID nas SharedPreferences para uso futuro
            prefs.edit().putString("deviceId", id).apply();
            Log.d("DeviceId", "Novo ID de dispositivo gerado e salvo: " + id);
        } else {
            Log.d("DeviceId", "ID de dispositivo existente recuperado: " + id);
        }
        return id;
    }

    private void showExitConfirmationDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(R.string.dialog_title);
        builder.setMessage(R.string.dialog_message);
        builder.setCancelable(true);
        builder.setPositiveButton("Sim", (dialogInterface, i) -> clearCacheAndExit());
        builder.setNegativeButton("Não", (dialogInterface, i) -> {
        });

        exitConfirmationDialog = builder.create();
        exitConfirmationDialog.show();
    }

    private void clearCacheAndExit() {
        webView.clearCache(true);
        android.webkit.CookieManager.getInstance().removeAllCookies(null);
        android.webkit.CookieManager.getInstance().flush();
        clearApplicationData();
        finish();
    }

    private void clearApplicationData() {
        File cache = getCacheDir();
        File appDir = new File(Objects.requireNonNull(cache.getParent()));
        if (appDir.exists()) {
            String[] children = appDir.list();
            assert children != null;
            for (String s : children) {
                if (!s.equals("lib")) {
                    deleteDir(new File(appDir, s));
                    Log.i("Clean cache", "**************** File /data/data/" + getApplicationContext().getPackageName() + "/" + s + " DELETED *******************");
                }
            }
        }
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