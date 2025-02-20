import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Tabs from "./Tabs";
import UserProfile from "./UserProfile";
import { Colors } from "@/constants/Colors";

type ProfileProps = {
  userId?: Id<"users">;
  showBackButton: boolean;
};

const Profile = ({ userId, showBackButton = false }: ProfileProps) => {
  const { userProfile } = useUserProfile();
  const { signOut } = useAuth();
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <FlatList
        data={
          [
            // { id: 1, name: "John Doe" },
            // { id: 2, name: "Jane Doe" },
            // { id: 3, name: "Alice Smith" },
            // { id: 4, name: "Bob Johnson" },
            // { id: 5, name: "Eve Brown" },
            // { id: 6, name: "Charlie Davis" },
          ]
        }
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            You haven't posted anything yet
          </Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={() => (
          <>
            <View style={styles.header}>
              {showBackButton ? (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="chevron-back" size={24} color={"#000"} />
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons name="web" size={24} />
              )}
              <View style={styles.headerRight}>
                <Ionicons name="logo-instagram" size={24} />
                <TouchableOpacity onPress={() => signOut()}>
                  <Ionicons name="log-out-outline" size={24} />
                </TouchableOpacity>
              </View>
            </View>
            {userId ? (
              <UserProfile userId={userId} />
            ) : (
              <UserProfile userId={userProfile?._id} />
            )}
            <Tabs onTabChange={() => {console.log("Cap")}} />
          </>
        )}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
  header: {
    paddingHorizontal: 12,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  emptyListText: {
    fontSize: 16,
    color: Colors.border,
    textAlign: "center",
    marginTop: 20,
  },
});
