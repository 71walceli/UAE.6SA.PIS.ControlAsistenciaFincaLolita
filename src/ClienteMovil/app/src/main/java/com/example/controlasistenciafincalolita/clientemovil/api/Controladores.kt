package com.example.controlasistenciafincalolita.clientemovil.api

import android.content.Context
import android.content.SharedPreferences


data class ModeloEmpleado (
    val id: Long,
    val nombre: String,
    val token_celular: String,
    val activo: Boolean,
    val tipo: String,
)
class ControladorEmpleado {
    fun guardarLocalmente(context: Context, empleado: ModeloEmpleado) {
        val sharedPreferencesEditor = context.getSharedPreferences("Usuario", Context.MODE_PRIVATE)
            .edit()
        sharedPreferencesEditor.putInt("id", empleado.id.toInt())
        sharedPreferencesEditor.putString("nombre", empleado.nombre)
        sharedPreferencesEditor.putString("token_celular", empleado.token_celular)
        sharedPreferencesEditor.putBoolean("activo", empleado.activo)
        sharedPreferencesEditor.putString("tipo", empleado.tipo)
        sharedPreferencesEditor.apply()
    }
    fun cargarLocalmente(context: Context) : ModeloEmpleado? {
        val sharedPreferences: SharedPreferences =
            context.getSharedPreferences("Usuario", Context.MODE_PRIVATE)
        if (sharedPreferences.contains("usuario")) {
            val datos = sharedPreferences.all
            return ModeloEmpleado(
                datos["id"] as Long,
                datos["nombre"] as String,
                datos["token_celular"] as String,
                datos["activo"] as Boolean,
                datos["tipo"] as String,
            )
        }
        return null
    }
    fun registrar(empleado: ModeloEmpleado) {

    }
}
