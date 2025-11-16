import { Stack } from "expo-router";

export default function ClientesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="crear" />
      <Stack.Screen name="editar/[id]" />
    </Stack>
  );
}
