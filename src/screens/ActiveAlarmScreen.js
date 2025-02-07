import React from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const API_URL = "https://bob-esponja-yh539.ondigitalocean.app";

const ActiveAlarmScreen = ({ route, navigation }) => {
  const { alarm, usuarioNSS } = route.params; // Asegúrate de que estos datos se pasen correctamente desde la navegación

  const stopAlarm = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permiso denegado", "Se necesita acceso a la cámara para apagar la alarma.");
        return;
      }

      const photo = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
        base64: false,
      });

      if (!photo.canceled && photo.assets?.length > 0) {
        const imageUri = photo.assets[0].uri;

        // Crear el FormData para enviar la imagen al backend
        const formData = new FormData();
        formData.append("imagen", {
          uri: imageUri,
          name: `alarma_${alarm.id}_${Date.now()}.jpg`,
          type: "image/jpeg",
        });
        formData.append("id", alarm.id);
        formData.append("usuario_nss", usuarioNSS);

        // Enviar la solicitud al backend
        const response = await axios.post(`${API_URL}/alarmas/apagar`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          Alert.alert("✔ Alarma apagada", "La foto ha sido registrada correctamente.");
          navigation.goBack();
        } else {
          Alert.alert("❌ Error", "No se pudo apagar la alarma. Inténtalo de nuevo.");
        }
      } else {
        Alert.alert("❌ Error", "No se pudo capturar la foto. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("❌ Error al apagar la alarma:", error);
      Alert.alert("❌ Error", "Hubo un problema al apagar la alarma.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Es hora de tomar tus medicamentos!</Text>
      <Text style={styles.alarmText}>Medicamento: {alarm.nombre_medicamento}</Text>
      <Text style={styles.alarmText}>Hora programada: {new Date(alarm.hora_programada).toLocaleString()}</Text>
      <Button title="Tomar Foto para Apagar" onPress={stopAlarm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FAF3DD" },
  title: { fontSize: 24, fontWeight: "bold", color: "#5E6472", textAlign: "center" },
  alarmText: { fontSize: 16, color: "#5E6472", marginVertical: 10 },
});

export default ActiveAlarmScreen;
