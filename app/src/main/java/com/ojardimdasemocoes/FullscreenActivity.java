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
        setContentView(R.layout.activity_fullscreen);

        // 1. Inicialize o WebView e suas configurações
        webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                Log.e("WebViewError", "Error: " + description + " at URL: " + failingUrl);
                // Opcional: mostrar uma mensagem de erro na UI ou carregar uma página local de erro
            }
        });

        // 2. Inicialize o Firebase
        mAuth = FirebaseAuth.getInstance();

        // 3. Obtenha ou gere o UID do usuário
        authenticateUser();

        // 4. Adiciona um callback para o botão de voltar
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                String currentUrl = webView.getUrl();
                // Se estiver na tela principal, mostra o diálogo para sair
                if (currentUrl != null && currentUrl.contains("mainScreen.html")) {
                    showExitConfirmationDialog();
                    // Se houver histórico de navegação, volte
                } else if (webView.canGoBack()) {
                    webView.goBack();
                    // Senão, mostra o diálogo para sair como último recurso
                } else {
                    showExitConfirmationDialog();
                }
            }
        });
    }

    private void authenticateUser() {
        // Adição: Verificar conexão com a internet antes de tentar autenticar
        if (!hasNetworkConnection()) {
            showErrorAndExit("Sem conexão com a internet. Por favor, conecte-se e reinicie o aplicativo.");
            // Opcional: carregar uma página HTML local de erro ou sem conexão
            // webView.loadUrl("file:///android_asset/no_connection.html");
            return;
        }

        firebaseUid = getSharedPreferences().getString(PREF_FIREBASE_UID, null);

        if (firebaseUid == null) {
            // UID não existe, autentica-se anonimamente
            mAuth.signInAnonymously().addOnCompleteListener(this, task -> {
                if (task.isSuccessful()) {
                    FirebaseUser user = mAuth.getCurrentUser();
                    if (user != null) {
                        firebaseUid = user.getUid();
                        // Salva o UID localmente para uso futuro
                        getSharedPreferences().edit().putString(PREF_FIREBASE_UID, firebaseUid).apply();
                        Log.d("Firebase", "UID gerado: " + firebaseUid);
                        // Carrega a URL com o UID
                        webView.loadUrl("file:///android_asset/splashScreen.html?uid=" + firebaseUid);
                    } else {
                        showErrorAndExit("Falha ao obter o UID do usuário. Reinicie o aplicativo.");
                    }
                } else {
                    Log.e("Firebase", "Falha na autenticação Firebase: " + Objects.requireNonNull(task.getException()).getMessage());
                    showErrorAndExit("Falha ao autenticar com o Firebase. Por favor, reinicie o aplicativo.");
                }
            });
        } else {
            // UID já existe, carrega a URL diretamente
            Log.d("Firebase", "UID encontrado: " + firebaseUid);
            webView.loadUrl("file:///android_asset/splashScreen.html?uid=" + firebaseUid);
        }
    }

    // Obtém as preferências compartilhadas
    private SharedPreferences getSharedPreferences() {
        return getSharedPreferences("app_prefs", MODE_PRIVATE);
    }

    // Mostra o diálogo de confirmação de saída
    private void showExitConfirmationDialog() {
        if (exitConfirmationDialog != null && exitConfirmationDialog.isShowing()) {
            return;
        }
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Sair do Aplicativo")
                .setMessage("Você tem certeza que deseja sair?")
                .setPositiveButton("Sim", (dialog, id) -> finish())
                .setNegativeButton("Não", (dialog, id) -> dialog.dismiss());
        exitConfirmationDialog = builder.create();
        exitConfirmationDialog.show();
    }

    // Exibe um erro e fecha a atividade
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

    // Verifica a conexão com a internet
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