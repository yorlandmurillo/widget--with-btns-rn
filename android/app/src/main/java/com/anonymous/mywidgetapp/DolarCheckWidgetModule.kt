package com.anonymous.mywidgetapp

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import android.widget.RemoteViews
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise


class DolarCheckWidgetModule(private val context: ReactApplicationContext)
    : ReactContextBaseJavaModule(context) {


    companion object {
        private const val PREFS_NAME = "DolarWidgetPrefs"
        private const val KEY_DOLAR = "dolarValue"
        private const val KEY_COUNT = "checkCount"
    }

    override fun getName(): String = "DolarCheckWidget"
    // This is like our little database, where we'll have all values saved

    @ReactMethod
    fun dataToShow(dolarInfo: String) {

        // Lets save the new value in Android Preference
        val prefs: SharedPreferences =
            context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

        prefs.edit().putString(KEY_DOLAR, dolarInfo).apply()


        // Manually update the widget
        val appWidgetManager = AppWidgetManager.getInstance(reactApplicationContext)
        val widgetComponent = ComponentName(reactApplicationContext, DolarCheckWidget::class.java)
        val widgetIds = appWidgetManager.getAppWidgetIds(widgetComponent)

        // Force update all widgets installed on the Screen
        widgetIds.forEach { widgetId ->
            val views = RemoteViews(reactApplicationContext.packageName, R.layout.dollar_view)

            // Set the saved value
            views.setTextViewText(R.id.dolarValue, dolarInfo)
            views.setTextViewText(R.id.loading, "")

            // Update the widget
            appWidgetManager.updateAppWidget(widgetId, views)
        }
    }

    @ReactMethod
    // Method to get in React native the Counter
    fun getCheckCount(promise: Promise) {
        try {
            Log.i("RnDolar", "comienza metodo getcheckCounter")
            val prefs = reactApplicationContext.getSharedPreferences(
                PREFS_NAME,
                Context.MODE_PRIVATE
            )
            Log.i("RnDolar", "consigue los valores guardados en shared?")

            val count = prefs.getInt(KEY_COUNT, 0)

            Log.i("RnDolar", "All preferences: ${prefs.all}")
            Log.i("RnDolar", "Count in Module: $count")

            promise.resolve(count)
        } catch (error: Exception) {
            promise.reject(
                "GET_CHECK_COUNT_ERROR",
                "We couldn't get the Dolar count from Widget",
                error
            )
        }
    }
}