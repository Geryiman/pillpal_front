import React, { useEffect, useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator"; // Importa la navegación
import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 🔹 Función para obtener el token de notificaciones push
async function obtenerTokenExpo() {
  if (!Device.isDevice) {
    Alert.alert("Debes usar un dispositivo real para recibir notificaciones");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Permiso denegado para recibir notificaciones");
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("🔑 Token Expo:", token);
  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState(null);

  useEffect(() => {
    // Obtener el token Expo
    obtenerTokenExpo().then(token => {
      if (token) {
        setExpoPushToken(token);
        enviarTokenAlBackend(token);
      }
    });

    // Escuchar cuando llega una notificación
    const subscriptionReceived = Notifications.addNotificationReceivedListener(notification => {
      console.log("📢 Notificación recibida:", notification);
    });

    // Escuchar cuando se presiona una notificación
    const subscriptionResponse = Notifications.addNotificationResponseReceivedListener(response => {
      const { screen, medicamento_id } = response.notification.request.content.data;
      if (screen) {
        // Navegar a la pantalla específica
        navigationRef.current?.navigate(screen, { medicamento_id });
      }
    });

    return () => {
      subscriptionReceived.remove();
      subscriptionResponse.remove();
    };
  }, []);

  // 🔹 Enviar el token al backend
  async function enviarTokenAlBackend(token) {
    try {
    const response = await fetch("https://bob-esponja-yh539.ondigitalocean.app/registrar-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nss: "12345678901", token_expo: token }),
      });
      if (!response.ok) {
        console.error("❌ Error al registrar el token en el backend.");
      }
    } catch (error) {
      console.error("❌ Error en la solicitud al backend:", error);
    }
  }

  return <AppNavigator />; // Renderiza la navegación completa
}
