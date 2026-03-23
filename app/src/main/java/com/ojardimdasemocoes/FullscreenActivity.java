package com.ojardimdasemocoes;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.webkit.WebViewAssetLoader;

import java.util.Locale;

public class FullscreenActivity extends AppCompatActivity {

    private WebView webView;
    private AlertDialog exitConfirmationDialog;

    @SuppressLint({"SetJavaScriptEnabled", "WrongViewCast"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Ativa a exibição de ponta a ponta (Edge-to-Edge) da maneira moderna
        EdgeToEdge.enable(this);
        
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_fullscreen);
        webView = findViewById(R.id.webview);

        // Lida com os recuos (insets) do sistema para garantir que o conteúdo não fique sob barras
        ViewCompat.setOnApplyWindowInsetsListener(webView, (v, windowInsets) -> {
            Insets insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars());

            String insetCommand = String.format(
                    Locale.US,
                    "document.documentElement.style.setProperty('--safe-area-inset-top', '%dpx');" +
                            "document.documentElement.style.setProperty('--safe-area-inset-bottom', '%dpx');" +
                            "document.documentElement.style.setProperty('--safe-area-inset-left', '%dpx');" +
                            "document.documentElement.style.setProperty('--safe-area-inset-right', '%dpx');",
                    insets.top, insets.bottom, insets.left, insets.right
            );
            webView.evaluateJavascript(insetCommand, null);

            return WindowInsetsCompat.CONSUMED;
        });


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

                if ((url.startsWith("http://") || url.startsWith("https://")) && !"appassets.androidplatform.net".equals(request.getUrl().getHost())) {
                    android.content.Intent intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, request.getUrl());
                    startActivity(intent);
                    return true;
                }
                return false;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    Log.e("WebViewError", "Error: " + error.getDescription() + " at URL: " + request.getUrl());
                }
            }
        });

        startApp();

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

    private void startApp() {
        final String baseUrl = "https://appassets.androidplatform.net/assets/main.html";
        webView.loadUrl(baseUrl);
    }

    private void showExitConfirmationDialog() {
        if (exitConfirmationDialog != null && exitConfirmationDialog.isShowing()) {
            return;
        }
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Sair do Aplicativo")
                .setMessage("Você tem certeza que deseja sair?")
                .setPositiveButton("Sim", (dialog, id) -> {
                    webView.evaluateJavascript("var music = document.getElementById('bgMusic'); if (music) { music.pause(); } localStorage.setItem('bgMusicState', 'paused');", null);
                    finish();
                })
                .setNegativeButton("Não", (dialog, id) -> dialog.dismiss());
        exitConfirmationDialog = builder.create();
        exitConfirmationDialog.show();
    }
}