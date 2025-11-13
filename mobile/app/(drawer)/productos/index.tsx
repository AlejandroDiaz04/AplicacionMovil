import { View, Text, StyleSheet } from "react-native";

export default function ProductosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Gestión de Productos - Próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 16,
    color: "#666",
  },
});
