# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

-keepattributes LineNumberTable,SourceFile
-renamesourcefileattribute SourceFile

# Manter a classe da Javascript Interface e seus membros
-keep class com.ojardimdasemocoes.FullscreenActivity$WebAppInterface { *; }

# Manter os métodos públicos anotados com @JavascriptInterface em qualquer classe
-keep public class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep all classes in your package 'com.ojardimdasemocoes'
-keep class com.ojardimdasemocoes.** { *; }

# Keep all classes that implement the 'OnClickListener' interface
-keepclassmembers class * implements android.view.View$OnClickListener {
    public void onClick(android.view.View);
}

# Keep all classes that extend the 'Activity' class
-keep public class * extends android.app.Activity

# Keep all classes that extend the 'Application' class
-keep public class * extends android.app.Application

# Keep all classes that extend the 'Fragment' class
-keep public class * extends android.app.Fragment

# Keep all classes that extend the 'DialogFragment' class
-keep public class * extends android.app.DialogFragment

# Keep all classes that extend the 'BroadcastReceiver' class
-keep public class * extends android.content.BroadcastReceiver

# Keep all classes that extend the 'Service' class
-keep public class * extends android.app.Service

# Keep all classes that extend the 'ContentProvider' class
-keep public class * extends android.content.ContentProvider

# Keep all classes that extend the 'ContentResolver' class
-keep public class * extends android.content.ContentResolver

# Keep all classes that extend the 'Cursor' class
-keep public class * extends android.database.Cursor

# Keep all classes that extend the 'View' class
-keep public class * extends android.view.View

# Keep all classes that extend the 'ViewGroup' class
-keep public class * extends android.view.ViewGroup

# Keep all classes that extend the 'Drawable' class
-keep public class * extends android.graphics.drawable.Drawable

# Keep all classes that extend the 'Bitmap' class
-keep public class * extends android.graphics.Bitmap

# Keep all classes that extend the 'Canvas' class
-keep public class * extends android.graphics.Canvas

# Keep all classes that extend the 'Paint' class
-keep public class * extends android.graphics.Paint

# Keep all classes that extend the 'Path' class
-keep public class * extends android.graphics.Path

# Keep all classes that extend the 'Matrix' class
-keep public class * extends android.graphics.Matrix

# Keep all classes that extend the 'RectF' class
-keep public class * extends android.graphics.RectF

# Keep all classes that extend the 'Color' class
-keep public class * extends android.graphics.Color

# Keep all classes that extend the 'Typeface' class
-keep public class * extends android.graphics.Typeface

# Keep all classes that extend the 'Animation' class
-keep public class * extends android.view.animation.Animation

# Keep all classes that extend the 'Animator' class
-keep public class * extends android.animation.Animator

# Keep all classes that extend the 'AnimatorSet' class
-keep public class * extends android.animation.AnimatorSet

# Keep all classes that extend the 'ObjectAnimator' class
-keep public class * extends android.animation.ObjectAnimator

# Keep all classes that extend the 'ValueAnimator' class
-keep public class * extends android.animation.ValueAnimator

# Keep all classes that extend the 'LayoutTransition' class
-keep public class * extends android.animation.LayoutTransition

# Keep all classes that extend the 'Transition' class
-keep public class * extends android.transition.Transition

# Keep all classes that extend the 'TransitionSet' class
-keep public class * extends android.transition.TransitionSet

# Keep all classes that extend the 'ChangeBounds' class
-keep public class * extends android.transition.ChangeBounds

# Keep all classes that extend the 'ChangeClipBounds' class
-keep public class * extends android.transition.ChangeClipBounds

# Keep all classes that extend the 'ChangeTransform' class
-keep public class * extends android.transition.ChangeTransform

# Keep all classes that extend the 'Fade' class
-keep public class * extends android.transition.Fade

# Keep all classes that extend the 'Slide' class
-keep public class * extends android.transition.Slide

# Keep all classes that extend the 'Explode' class
-keep public class * extends android.transition.Explode

# Keep all classes that extend the 'Visibility' class
-keep public class * extends android.transition.Visibility

# Keep all classes that extend the 'AutoTransition' class
-keep public class * extends android.transition.AutoTransition

# Keep all classes that extend the 'Scene' class
-keep public class * extends android.transition.Scene

# Keep all classes that extend the 'TransitionManager' class
-keep public class * extends android.transition.TransitionManager

# Keep all classes that extend the 'ViewAnimationUtils' class
-keep public class * extends android.view.ViewAnimationUtils

# Keep all classes that extend the 'ViewPropertyAnimator' class
-keep public class * extends android.view.ViewPropertyAnimator

# Keep all classes that extend the 'PropertyValuesHolder' class
-keep public class * extends android.animation.PropertyValuesHolder

# Keep all classes that extend the 'AnimatorListenerAdapter' class
-keep public class * extends android.animation.AnimatorListenerAdapter
