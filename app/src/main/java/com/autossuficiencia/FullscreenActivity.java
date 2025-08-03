package com.autossuficiencia;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Objects;

public class FullscreenActivity extends AppCompatActivity {

    private WebView webView;
    private SwipeRefreshLayout swipeRefreshLayout;
    private String webUrl;
    private AlertDialog exitConfirmationDialog;
    private ValueCallback<Uri[]> uploadMessage;
    private ActivityResultLauncher<Intent> fileChooserLauncher;

    private static boolean deleteDir(File dir) {
        if (dir != null && dir.isDirectory()) {
            String[] children = dir.list();
            for (int i = 0; i < Objects.requireNonNull(children).length; i++) {
                boolean success = deleteDir(new File(dir, children[i]));
                if (!success) {
                    return false;
                }
            }
        }
        assert dir != null;
        return dir.delete();
    }

    @SuppressLint({"SetJavaScriptEnabled", "JavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fullscreen);

        webUrl = getString(R.string.web_url);

        webView = findViewById(R.id.webview);
        swipeRefreshLayout = findViewById(R.id.swipe_refresh_layout);

        webView.setVisibility(View.GONE);

        // Initialize the ActivityResultLauncher for file selection
        fileChooserLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    Log.d("FileChooser", "ActivityResultLauncher callback (file selection)");
                    if (uploadMessage == null) {
                        Log.w("FileChooser", "uploadMessage is null, ignoring result");
                        return;
                    }

                    if (result.getResultCode() == Activity.RESULT_OK) {
                        Intent data = result.getData();
                        Uri[] results = null;
                        if (data != null) {
                            results = new Uri[]{data.getData()};
                            Log.d("FileChooser", "File selected: " + data.getData());
                        } else {
                            Log.w("FileChooser", "No file selected");
                        }
                        uploadMessage.onReceiveValue(results);
                    } else {
                        Log.i("FileChooser", "File selection cancelled");
                        uploadMessage = null;
                    }
                    uploadMessage = null;
                });


        loadWebContent();
        webView.addJavascriptInterface(this, "android");

        swipeRefreshLayout.setOnRefreshListener(() -> webView.reload());

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

                if (swipeRefreshLayout.isRefreshing()) {
                    swipeRefreshLayout.setRefreshing(false);
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.equals("https://saldofacil.vercel.app/chat.html")) {
                    swipeRefreshLayout.setEnabled(false);
                    return false;
                } else {
                    swipeRefreshLayout.setEnabled(true);
                }
                return false;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
                Log.d("FileChooser", "onShowFileChooser called");
                uploadMessage = filePathCallback;

                // Launch file chooser
                openFileChooser();
                return true;
            }
        });

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true); // Important: Allow file access
        settings.setAllowContentAccess(true); // Also consider this one
        webView.addJavascriptInterface(this, "android");

        webView.setDownloadListener((url, userAgent, contentDisposition, mimetype, contentLength) -> {
            String filename = URLUtil.guessFileName(url, contentDisposition, mimetype);
            downloadFile(url, filename);
        });

        // Check network connection before loading URL
        if (hasNetworkConnection()) {
            webView.clearCache(true);
            webView.loadUrl(webUrl);
        } else {
            showNetworkAlertDialog();
        }
    }

    private void openFileChooser() {
        Log.d("FileChooser", "Launching file chooser intent");
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/x-ofx"); // Specify the MIME type for OFX files, if known
        intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/x-ofx", "application/octet-stream", "*/*"}); // set multiple types
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        try {
            fileChooserLauncher.launch(intent);
        } catch (Exception e) {
            Log.e("FileChooser", "Error launching file chooser: " + e.getMessage(), e);
            // Handle the error, maybe show a message to the user
            uploadMessage.onReceiveValue(null); // Inform WebView of failure
            uploadMessage = null;
        }
    }

    private void showExitConfirmationDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setTitle(R.string.dialog_title);
        builder.setMessage(R.string.dialog_message);
        builder.setCancelable(true);

        builder.setPositiveButton("Sim", (dialogInterface, i) -> clearCacheAndExit());

        builder.setNegativeButton("Não", (dialogInterface, i) -> {
            // Do nothing, just dismiss the dialog
        });

        exitConfirmationDialog = builder.create();
        exitConfirmationDialog.show();
    }

    private void clearCacheAndExit() {
        // Clear WebView cache
        webView.clearCache(true);

        // Clear Cookies (optional, but good practice)
        android.webkit.CookieManager.getInstance().removeAllCookies(null);
        android.webkit.CookieManager.getInstance().flush();

        // Optional: Function to clear all app data (USE WITH CAUTION)
        clearApplicationData();

        // Finish the activity
        finish();
    }

    // Optional: Function to clear all app data (USE WITH CAUTION)
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
            // You might want to handle reconnection or retry logic here
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

    @JavascriptInterface
    public void downloadFile(String base64Data, String fileName) {
        try {
            byte[] decodedBytes = Base64.decode(base64Data, Base64.DEFAULT);

            String mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

            ContentValues values = new ContentValues();
            values.put(MediaStore.MediaColumns.DISPLAY_NAME, fileName);
            values.put(MediaStore.MediaColumns.MIME_TYPE, mimeType);
            values.put(MediaStore.MediaColumns.IS_PENDING, 1);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOCUMENTS);
            }

            Uri collection = MediaStore.Files.getContentUri("external");
            Uri uri = getContentResolver().insert(collection, values);

            try (OutputStream outputStream = getContentResolver().openOutputStream(uri)) {
                outputStream.write(decodedBytes);
            } catch (IOException e) {
                Log.e("Download", "Erro ao escrever no arquivo: " + e.getMessage(), e);
                getContentResolver().delete(uri, null, null);
                throw e;
            }

            values.clear();
            values.put(MediaStore.MediaColumns.IS_PENDING, 0);
            getContentResolver().update(uri, values, null, null);

            Log.i("Download", "Arquivo salvo com sucesso em: " + uri);
            runOnUiThread(() -> Toast.makeText(FullscreenActivity.this, "Salvo em: " + fileName, Toast.LENGTH_LONG).show());

        } catch (Exception e) {
            Log.e("Download", "Erro ao processar download: " + e.getMessage(), e);
            runOnUiThread(() -> Toast.makeText(FullscreenActivity.this, "Falha no download: " + e.getMessage(), Toast.LENGTH_LONG).show());
        }
    }

}