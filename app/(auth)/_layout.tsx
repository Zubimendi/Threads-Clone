import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "white",
        },
        headerShadowVisible: false,
        animation: "slide_from_bottom", // Adds a sliding effect
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)/create"
        options={{
          presentation: "transparentModal", // Use 'transparentModal' if needed
          title: "New Thread",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("(tabs)/create")}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          ),
          headerLeft: () => null, // Disable the default back button
          headerBackVisible: false, // Ensure the back button is hidden
        }}
      />
      <Stack.Screen
        name="(modal)/edit-profile"
        options={{
          presentation: "modal", // Use 'transparentModal' if needed
          title: "Edit Profile",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.dismiss()}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
          headerBackVisible: false, // Ensure the back button is hidden
        }}
      />
    </Stack>
  );
};

export default Layout;