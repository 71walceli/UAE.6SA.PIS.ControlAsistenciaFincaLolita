package com.example.controlasistenciafincalolita.clientemovil

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.Display
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import com.example.controlasistenciafincalolita.clientemovil.api.ControladorAsistencia
import com.example.controlasistenciafincalolita.clientemovil.api.ControladorEmpleado
import com.example.controlasistenciafincalolita.clientemovil.api.ModeloAsistencia
import com.example.controlasistenciafincalolita.clientemovil.api.ModeloEmpleado
import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import com.google.zxing.integration.android.IntentIntegrator
import java.util.*
import kotlin.concurrent.thread

// TODO Ubicar todas las cadenas de texto visibles en strings.xml
class Intro : AppCompatActivity() {
    var estadoRegistroAsistencia: Boolean? = null
    private var _empleado: ModeloEmpleado? = null
    var empleado: ModeloEmpleado
        get() = _empleado!!
        set(value) {
            ControladorEmpleado.guardarLocalmente(this, value)
            findViewById<TextView>(R.id.bienvendioUsuario).text = resources.getString(
                R.string.bienvenidoUsuario,
                if (value.id != 0 .toLong()) value.nombre else "Nuevo Usuario")
            findViewById<TextView>(R.id.eitquetaPrimaria).text =
                if (empleado.id >= 0 .toLong())
                    "Escanee el código QR de Administración para poder registrar su asistencia"
                else "Aún no ha registrado su asistencia."
            Log.d("Intro", "SET empleado: empleado.id = ${value.id}")
            _empleado = value
        }
    private var _ultimaAsistencia: ModeloAsistencia? = null
    var ultimaAsistencia: ModeloAsistencia
        get() = _ultimaAsistencia!!
        set(value) {
            // TODO REvisar...
            findViewById<TextView>(R.id.eitquetaPrimaria).text =
                if (empleado.id != 0 .toLong()) getString(R.string.necesitaRegistrarse)
                else (if (value.id != 0) "Gracias por registrar su asistencia."
                    else "Aún no ha registrado su asistencia.")
            // TODO Obtener fecha y hora desde el servidor, a través de la API
            findViewById<TextView>(R.id.etiquetaSecundaria).text =
                if (value.id != 0) getString(R.string.ustedRegistroHora, value.fecha_hora)
                else ""
            // TODO Cambiar color de fondo según estado...
            if (value.id != 0) {
                findViewById<TextView>(R.id.iconoCorrectoError).text = "\uf00c"
                findViewById<TextView>(R.id.iconoCorrectoError).setTextColor(
                    resources.getColor(R.color.correcto))
                findViewById<TextView>(R.id.iconoUsuario).setTextColor(
                    resources.getColor(R.color.correcto))
            } else if (value.id != 0) {
                findViewById<TextView>(R.id.iconoCorrectoError).text = "\uf00d"
                findViewById<TextView>(R.id.iconoCorrectoError).setTextColor(
                    resources.getColor(R.color.error))
                findViewById<TextView>(R.id.iconoUsuario).setTextColor(
                    resources.getColor(R.color.error))
            } else {
                findViewById<TextView>(R.id.iconoCorrectoError).text = "\uf013"
                findViewById<TextView>(R.id.iconoCorrectoError).setTextColor(
                    resources.getColor(R.color.black))
                findViewById<TextView>(R.id.iconoUsuario).setTextColor(
                    resources.getColor(R.color.black))
            }
            Log.d("Intro", "SET asistencia: asistencia.id = ${value.id}")
            _ultimaAsistencia = value
        }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_intro)

        _empleado = ControladorEmpleado.cargarLocalmente(this)
        empleado = _empleado!!

        //Log.d("Intro", "empleado.id = ${empleado.id}")

        //IniciarEscaneoQr()

        // TODO Si no hay datos de usuario, el botón debe pedir registrarse en lugar de solo escanear.
        findViewById<Button>(R.id.botonEscanierQr).setOnClickListener {
            IniciarEscaneoQr()
        }
    }

    private fun IniciarEscaneoQr() {
        val intentIntegrator = IntentIntegrator(this)
        intentIntegrator.setDesiredBarcodeFormats(listOf(IntentIntegrator.QR_CODE))
        intentIntegrator.captureActivity = EscaneoCodigoQr::class.java
        if (empleado.id != 0 .toLong()) {
            intentIntegrator.setPrompt("Apunte el cuadro en el código QR para registrar su asistencia.")
        } else {
            intentIntegrator.setPrompt("Apunte el cuadro en el código QR para registrar su celular.")
        }
        intentIntegrator.initiateScan()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        val result = IntentIntegrator.parseActivityResult(resultCode, data)
        if (result != null && result.contents != null) {
            Log.d("Intro", "Escaneado QR: ${result.contents}")
            if (empleado.id != 0 .toLong()) {
                thread {
                    val nuevaAsistencia = ModeloAsistencia(empleado.id, result.contents)
                    val response =
                        ControladorAsistencia.registrar(this, nuevaAsistencia)
                    ContextCompat.getMainExecutor(this).execute {
                        val mensaje =
                            if (response.isSuccessful) "Se creó el registro de asistencia."
                            else "Falló el registro de asistencia."
                        Toast.makeText(this, mensaje, Toast.LENGTH_LONG).show()
                        if (response.isSuccessful) {
                            // TODO Inicializar según valores devueltos por API
                            ultimaAsistencia = ModeloAsistencia(1, empleado.id, result.contents,
                                Date(), "")
                        } else {
                            ultimaAsistencia = nuevaAsistencia
                        }
                        estadoRegistroAsistencia = response.isSuccessful
                    }
                }
            } else {
                try {
                    var nuevoEmpleado =  Gson().fromJson(result.contents, ModeloEmpleado::class.java)
                    val charPool : List<Char> = ('a'..'z') + ('A'..'Z') + ('0'..'9')
                    val tokenCelular = (1..58)
                        .map{ charPool.random() }
                        .joinToString("")

                    nuevoEmpleado = ModeloEmpleado(nuevoEmpleado.id, nuevoEmpleado.nombre, tokenCelular,
                        nuevoEmpleado.activo, nuevoEmpleado.tipo)

                    thread {
                        val operacionApi = ControladorEmpleado.actualizar(nuevoEmpleado)
                        ContextCompat.getMainExecutor(this).execute {
                            if (operacionApi.isSuccessful) {
                                empleado = nuevoEmpleado
                            } else {
                                Toast.makeText(this,
                                    "Falló el registro de usuario en el servidor.",
                                    Toast.LENGTH_LONG).show()
                            }
                        }
                    }
                } catch (exception: JsonSyntaxException) {
                    Toast.makeText(this,
                        "No se pude registrar el jormalero. Código QR incorrecto.",
                        Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}