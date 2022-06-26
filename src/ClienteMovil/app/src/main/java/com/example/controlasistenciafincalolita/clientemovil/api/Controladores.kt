package com.example.controlasistenciafincalolita.clientemovil.api

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import okhttp3.*
import java.util.*


data class ModeloEmpleado (
    val id: Long,
    val nombre: String,
    val token_celular: String,
    val activo: Boolean,
    val tipo: String,
) {
    constructor() : this(0, "", "", false, "")
}
public object ControladorEmpleado {
    public fun registrar(empleado: ModeloEmpleado) : Response {
        throw NotImplementedError()
    }
    public fun actualizar(empleado: ModeloEmpleado) : Response {
        val json = Gson().toJson(mapOf(
            "id" to empleado.id.toString().padStart(10, '0'),
            "token_celular" to empleado.token_celular,
        ).toMap())

        return Api.hacerSolicitudApiServidor("empleado.php?registrar_celular", "POST", json)
    }
    public fun guardarLocalmente(context: Context, empleado: ModeloEmpleado) {
        val sharedPreferencesEditor = context.getSharedPreferences("Usuario", Context.MODE_PRIVATE)
            .edit()
        sharedPreferencesEditor.putLong("id", empleado.id)
        sharedPreferencesEditor.putString("nombre", empleado.nombre)
        sharedPreferencesEditor.putString("token_celular", empleado.token_celular)
        sharedPreferencesEditor.putBoolean("activo", empleado.activo)
        sharedPreferencesEditor.putString("tipo", empleado.tipo)
        sharedPreferencesEditor.apply()
    }
    public fun cargarLocalmente(context: Context) : ModeloEmpleado {
        val prefKey = "Usuario"
        val sharedPreferences: SharedPreferences =
            context.getSharedPreferences(prefKey, Context.MODE_PRIVATE)
        if (sharedPreferences.contains("id")) {
            val datos = sharedPreferences.all
            return ModeloEmpleado(
                datos["id"] as Long,
                datos["nombre"] as String,
                datos["token_celular"] as String,
                datos["activo"] as Boolean,
                datos["tipo"] as String,
            )
        }
        return ModeloEmpleado()
    }
}


data class ModeloAsistencia(
    val id: Int,
    val empleado_id: Long,
    val codigoQrToken: String,
    val fecha_hora: Date,
    val observacion: String,
) {
    constructor(empleadoId: Long, codigoQrToken: String)
            : this(0, empleadoId, codigoQrToken, Date(), "")
}
public object ControladorAsistencia {
    public fun registrar(context: Context, asistencia: ModeloAsistencia) : Response {
        val empleado = ControladorEmpleado.cargarLocalmente(context)

        val json = Gson().toJson(mapOf(
            "empleado_id" to asistencia.empleado_id,
            "empleado_token_celular" to empleado.token_celular,
            "codigo_qr_token" to asistencia.codigoQrToken,
        ).toMap())

        return Api.hacerSolicitudApiServidor("asistencia.php?registrar", "POST", json)
    }
}
