package com.autossuficiencia;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class FullscreenActivity extends AppCompatActivity {

    private WebView webView;
    private SwipeRefreshLayout swipeRefreshLayout;
    private String webUrl;
    private boolean isExitDialogShowing = false; // Flag to track exit dialog visibility

    @RequiresApi(api = Build.VERSION_CODES.M)
    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fullscreen);

        webUrl = getString(R.string.web_url);

        webView = findViewById(R.id.webview);
        swipeRefreshLayout = findViewById(R.id.swipe_refresh_layout);

        webView.setVisibility(View.GONE);

        loadWebContent();

        swipeRefreshLayout.setOnRefreshListener(() -> webView.reload());

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (!isExitDialogShowing) {
                    showExitConfirmationDialog();
                    isExitDialogShowing = true;
                }
            }
        });
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @SuppressLint("SetJavaScriptEnabled")
    private void loadWebContent() {
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                webView.setVisibility(View.VISIBLE); // Just set visibility to VISIBLE

                if (swipeRefreshLayout.isRefreshing()) {
                    swipeRefreshLayout.setRefreshing(false);
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("whatsapp://chat/")) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                }
                return false;
            }
        });

        webView.setWebChromeClient(new WebChromeClient());

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setDomStorageEnabled(true);

        // Check network connection before loading URL
        if (hasNetworkConnection()) {
            webView.loadUrl(webUrl);
        } else {
            showNetworkAlertDialog();
        }
    }

    private void showExitConfirmationDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setTitle(R.string.dialog_title);
        builder.setMessage(R.string.dialog_message);
        builder.setCancelable(true);

        builder.setPositiveButton("Sim", (dialogInterface, i) -> {
            finish();
            isExitDialogShowing = false; // Reset the flag when the dialog is dismissed
        });

        builder.setNegativeButton("Não", (dialogInterface, i) -> {
            isExitDialogShowing = false; // Reset the flag when the dialog is dismissed
        });

        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private void showNetworkAlertDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("Por favor conecte-se à internet!");
        builder.setTitle("Sem conexão de rede");
        builder.setPositiveButton("OK", (dialog, id) -> {
            // You might want to handle reconnection or retry logic here
        });
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    private boolean hasNetworkConnection() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivityManager == null) {
            return false;
        }

        NetworkCapabilities capabilities = connectivityManager.getNetworkCapabilities(connectivityManager.getActiveNetwork());
        return capabilities != null &&
                capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED);
    }
}