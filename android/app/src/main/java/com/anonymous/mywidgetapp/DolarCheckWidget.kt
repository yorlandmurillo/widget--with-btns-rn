package com.anonymous.mywidgetapp

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.util.Log
import android.widget.RemoteViews

class DolarCheckWidget : AppWidgetProvider() {

    companion object {
        private const val ACTION_INCREMENT =
            "com.yourapp.ACTION_INCREMENT"

        // This is like our little database, where we'll have all values saved
        private const val PREFS_NAME = "DolarWidgetPrefs"
        private const val KEY_COUNT = "checkCount"
        private const val KEY_DOLAR = "dolarValue"
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        Log.i("RnDolar", "pasa el update!!")
        val prefs = context?.getSharedPreferences(
            KEY_DOLAR,
            Context.MODE_PRIVATE
        )

        val dolarValue = prefs?.getString(KEY_DOLAR, "0")
        Log.i("RnDolar", "Dolar Value in widget: $dolarValue")

        appWidgetIds.forEach { widgetId ->

            // Show loading state
            val loadingViews = RemoteViews(context.packageName, R.layout.dollar_view)

            loadingViews.setTextViewText(R.id.loading, " ")

            loadingViews.setTextViewText(R.id.dolarValue, dolarValue)

            appWidgetManager.updateAppWidget(widgetId, loadingViews)

            updateWidget(context, appWidgetManager, widgetId)
        }
    }

    override fun onReceive(
        context: Context,
        intent: Intent
    ) {
        // When we click on the button and Receive the info
        super.onReceive(context, intent)

        if (intent.action == ACTION_INCREMENT) {
            incrementCounter(context)
            updateAllWidgets(context)
        }
    }

    private fun incrementCounter(context: Context) {
        //For save data we use SharedPreferences
        val prefs = context.getSharedPreferences(
            PREFS_NAME,
            Context.MODE_PRIVATE
        )

        val currentCount = prefs.getInt(KEY_COUNT, 0)

        prefs.edit()
            .putInt(KEY_COUNT, currentCount + 1)
            .apply()
    }

    private fun updateWidget(
        context: Context,
        appWidgetManager: AppWidgetManager,
        widgetId: Int
    ) {
        val prefs = context.getSharedPreferences(
            PREFS_NAME,
            Context.MODE_PRIVATE
        )

        val count = prefs.getInt(KEY_COUNT, 0)

        val views = RemoteViews(
            context.packageName,
            R.layout.dollar_view
        )

        views.setTextViewText(
            R.id.counterTimes,
            "Chequeados: $count veces"
        )

        val incrementIntent = Intent(
            context,
            DolarCheckWidget::class.java
        ).apply {
            action = ACTION_INCREMENT
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            widgetId,
            incrementIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or
                PendingIntent.FLAG_IMMUTABLE
        )

        // this is the button Listener
        views.setOnClickPendingIntent(
            R.id.btnAction,
            pendingIntent
        )

        appWidgetManager.updateAppWidget(widgetId, views)
    }

    // this looks for every widget instance in the app and updates them
    private fun updateAllWidgets(context: Context) {
        val appWidgetManager =
            AppWidgetManager.getInstance(context)

        val widgetComponent = ComponentName(
            context,
            DolarCheckWidget::class.java
        )

        val widgetIds = appWidgetManager.getAppWidgetIds(
            widgetComponent
        )

        widgetIds.forEach { widgetId ->
            updateWidget(context, appWidgetManager, widgetId)
        }
    }
}