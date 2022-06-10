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

class Intro : AppCompatActivity() {
    var estado: Boolean? = null
        set(value) {
            // TODO Cambiar color de fondo según estado...
            if (value == true) {
                findViewById<TextView>(R.id.iconoCorrectoError).text = "\uf00c"
            } else if (value == false) {
                findViewById<TextView>(R.id.iconoCorrectoError).text = "\uf00d"
            } else {
                findViewById<TextView>(R.id.iconoCorrectoError).text = "\uf013"
            }
            field = value
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_intro)

        findViewById<TextView>(R.id.bienvendioUsuario).text = resources.getString(R.string.bienvenidoUsuario, "Walter Celi")
        IniciarEscaneoQr()

        findViewById<Button>(R.id.botonEscanierQr).setOnClickListener {
            IniciarEscaneoQr()
        }

        estado = null;
    }

    private fun IniciarEscaneoQr() {
        val intentIntegrator = IntentIntegrator(this)
        intentIntegrator.setDesiredBarcodeFormats(listOf(IntentIntegrator.QR_CODE))
        intentIntegrator.setCaptureActivity(EscaneoCodigoQr::class.java)
        intentIntegrator.setPrompt("Apunte la cámara hacia el código QR.")
        intentIntegrator.initiateScan()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        var result = IntentIntegrator.parseActivityResult(resultCode, data)
        if (result != null && result.contents != null) {
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