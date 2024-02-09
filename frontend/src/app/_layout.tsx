import "../global.css";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#13141C",
        },
      }}
      initialRouteName="(tabs)"
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="appDetail/[name]" />
    </Stack>
  );
}
