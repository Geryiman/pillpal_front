import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";

const backendUrl = "https://bob-esponja-yh539.ondigitalocean.app";

const RegisterScreen = ({ navigation }) => {
  const [nss, setNss] = useState("");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("Masculino");
  const [contraseña, setContraseña] = useState("");

  const handleRegister = async () => {
    if (!nss || !nombre || !edad || !sexo || !contraseña) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/usuarios`, {
        nss,
        nombre,
        edad,
        sexo,
        contraseña,
      });

      if (response.status === 201) {
        Alert.alert("Registro exitoso", "Usuario registrado correctamente.");
        navigation.navigate("HomeScreen"); // Redirigir a la pantalla principal después del registro
      } else {
        Alert.alert("Error", response.data.error || "Error al registrar usuario.");
      }
    } catch (error) {
      Alert.alert("Error", "Error al conectar con el servidor.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        style={styles.input}
        placeholder="NSS (11 dígitos)"
        value={nss}
        onChangeText={setNss}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Selecciona tu sexo:</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.sexoButton,
            sexo === "Masculino" && styles.selectedButton,
          ]}
          onPress={() => setSexo("Masculino")}
        >
          <Text style={styles.buttonText}>Masculino</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sexoButton,
            sexo === "Femenino" && styles.selectedButton,
          ]}
          onPress={() => setSexo("Femenino")}
        >
          <Text style={styles.buttonText}>Femenino</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contraseña}
        secureTextEntry
        onChangeText={setContraseña}
      />

      <Button title="Registrar" onPress={handleRegister} />

      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión aquí</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// 📌 Estilos
const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#FAF3DD" },
  title: { fontSize: 24, fontWeight: "bold", color: "#5E6472", marginBottom: 20 },
  input: { width: "100%", padding: 10, borderWidth: 1, borderRadius: 8, backgroundColor: "#B8F2E6", marginBottom: 15 },
  label: { fontSize: 16, color: "#5E6472", marginBottom: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  sexoButton: { flex: 1, padding: 10, marginHorizontal: 5, borderWidth: 1, borderRadius: 8, alignItems: "center", backgroundColor: "#B8F2E6" },
  selectedButton: { backgroundColor: "#5E6472" },
  buttonText: { color: "#FFFFFF", fontWeight: "bold" },
  link: { color: "#5E6472", textDecorationLine: "underline", marginTop: 15 },
});

export default RegisterScreen;
