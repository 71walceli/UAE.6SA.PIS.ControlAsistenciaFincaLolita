package com.example.controlasistenciafincalolita.clientemovil

import android.app.SearchManager
import android.content.DialogInterface
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import com.google.zxing.integration.android.IntentIntegrator

class EscaneoCodigoQr : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_escaneo_codigo_qr)
        val textView: TextView = findViewById(R.id.textView)
        val qrButton: Button = findViewById(R.id.qr_button)
        qrButton.setOnClickListener {
            val intentIntegrator = IntentIntegrator(this)
            intentIntegrator.setDesiredBarcodeFormats(listOf(IntentIntegrator.QR_CODE))
            intentIntegrator.initiateScan()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        var result = IntentIntegrator.parseActivityResult(resultCode, data)
        if (result != null) {
            AlertDialog.Builder(this)
                .setMessage("Would you like to go to ${result.contents}?")
                .setPositiveButton("Yes", DialogInterface.OnClickListener { dialogInterface, i ->
                    val intent = Intent(Intent.ACTION_WEB_SEARCH)
                    intent.putExtra(SearchManager.QUERY,result.contents)
                    startActivity(intent)
                })
                .setNegativeButton("No", DialogInterface.OnClickListener { dialogInterface, i ->  })
                .create()
                .show()

        }
    }
}