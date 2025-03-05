import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";

type UserProfileProps = {
  userId?: Id<"users">;
};

const UserProfile = ({ userId }: UserProfileProps) => {
  const { userProfile } = useUserProfile();
  const profile = useQuery(api.users.getUserById, {
    userId: userId as Id<"users">,
  });
  const isSelf = userId === userProfile?._id;
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileTextContainer}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {profile?.first_name} {profile?.last_name}
          </Text>
          <Text style={styles.username} numberOfLines={1}>
            @{profile?.username}
          </Text>
        </View>
        <Image
          source={{ uri: profile?.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.bio} numberOfLines={3}>
        {profile?.bio || "No Bio"}
      </Text>
      <Text style={styles.followerCount} numberOfLines={1}>
        {profile?.followersCount} followers •{" "}
        {profile?.websiteUrl || "No Website"}
      </Text>
    
      <View style={styles.buttonRow}>
        {isSelf && (
          <>
            <View>
              <Link
                href={`/(auth)/(modal)/edit-profile?userId=${profile?._id || ""}&imgUrl=${profile?.imageUrl ? encodeURIComponent(profile.imageUrl) : ""}&biostring=${profile?.bio ? encodeURIComponent(profile.bio) : ""}&linkstring=${profile?.websiteUrl ? encodeURIComponent(profile.websiteUrl) : ""}`}
                asChild
              >
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
              </Link>
            </View>
            <View>
              <Link href={"/"} asChild>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Share Profile</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </>
        )}
      </View>

      <View style={styles.buttonRow}>
        {!isSelf && (
          <>
            <View>
              <Link href={"/"} asChild>
                <TouchableOpacity style={styles.fullButton}>
                  <Text style={styles.fullButtonText}>Follow</Text>
                </TouchableOpacity>
              </Link>
            </View>
            <View>
              <Link href={"/"} asChild>
                <TouchableOpacity style={styles.fullButton}>
                  <Text style={styles.fullButtonText}>Mention</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04, // responsive padding
    maxWidth: 600, // maximum width for larger screens
    alignSelf: "center",
    width: "100%",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: width * 0.03,
  },
  profileTextContainer: {
    flex: 1,
    gap: 6,
    marginRight: 16,
  },
  name: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: "bold",
  },
  username: {
    fontSize: Math.max(14, width * 0.035),
    color: "grey",
  },
  image: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    minWidth: 50,
    minHeight: 50,
  },
  bio: {
    marginTop: width * 0.04,
    fontSize: Math.max(14, width * 0.035),
    lineHeight: Math.max(20, width * 0.05),
  },
  followerCount: {
    marginTop: width * 0.03,
    fontSize: Math.max(13, width * 0.032),
    color: "#666",
  },
  buttonRow: {
    flexDirection: "row",
    gap: width * 0.03,
    justifyContent: "space-evenly",
    marginTop: width * 0.04,
  },
  button: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.06, // increased horizontal padding
    borderRadius: 8, // reduced border radius
    minWidth: width * 0.4, // increased minimum width
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  fullButton: {
    backgroundColor: "#000",
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.06, // increased horizontal padding
    borderRadius: 8, // reduced border radius
    borderWidth: 1,
    borderColor: "#000",
    minWidth: width * 0.4, // increased minimum width
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  fullButtonText: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
  },
  buttonText: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
});

export default UserProfile;
