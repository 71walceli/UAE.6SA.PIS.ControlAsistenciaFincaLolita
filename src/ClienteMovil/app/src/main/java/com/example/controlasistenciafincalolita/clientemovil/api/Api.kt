package com.example.controlasistenciafincalolita.clientemovil.api;

import android.util.Log
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody

public object Api {
    val MEDIA_TYPE = "application/json";
    val API_PATH = "http://10.255.255.241/api/"

    public fun hacerSolicitudApiServidor(query: String, method: String, json: String = "")
    : Response {
        /* Hacer solicitudes al API del servidor por derecto
        * */
        val client: OkHttpClient = OkHttpClient().newBuilder().build()
        val mediaType: MediaType = MEDIA_TYPE.toMediaTypeOrNull()!!
        var request = Request.Builder()
            .url("${API_PATH}${query}")
            .addHeader("Content-Type", MEDIA_TYPE)
        request = if (method in listOf("POST", "PUT", "DELETE")) {
            request
                .method(method, json.toRequestBody(mediaType))
        } else {
            request
        }
        val response: Response = client.newCall(request.build()).execute()
        Log.d("ApiMovil", "Solicitud: ${method} ${API_PATH}${query}")
        Log.d("ApiMovil", "\t${json}")
        Log.d("ApiMovil", "Respuesta: ")
        Log.d("ApiMovil", "\t${response.peekBody(Long.MAX_VALUE).string()}")
        return response
    }
}
