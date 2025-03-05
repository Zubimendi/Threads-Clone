import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter, Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";

const Page = () => {
  const { biostring, linkstring, userId, imgUrl } = useLocalSearchParams<{
    biostring: string;
    linkstring: string;
    userId: string;
    imgUrl: string;
  }>();

  // Add useState hooks
  const [bio, setBio] = useState(biostring || "");
  const [link, setLink] = useState(linkstring || "");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // Add useMutation hook
  const updateUserProfile = useMutation(api.users.updateUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const router = useRouter();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    let storageId = null;
    // Call the updateUserProfile mutation
    if (selectedImage) {
      storageId = await updateProfilePicture();
      console.log("Storage ID", storageId)
    }
    await updateUserProfile({
      _id: userId as Id<"users">,
      bio,
      websiteUrl: link,
      imageUrl: selectedImage ? storageId as Id<"_storage">: imgUrl as Id<"_storage">,
    });
    router.dismiss();
  };

  const updateProfilePicture = async () => {
    const uploadUrl = await generateUploadUrl();
    const response = await fetch(selectedImage!);
    const blob = await response.blob();

    const result = await fetch(uploadUrl!, {
      method: "POST",
      body: blob,
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
    const { storageId } = await result.json();
    return storageId;
  };

  return (
    <View>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={handleUpdate}>
              <Text>Done</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Pressable onPress={pickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <Image source={{ uri: imgUrl }} style={styles.image} />
        )}
      </Pressable>
      <View style={styles.section}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.bioInput}
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholder="Tell us about yourself"
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Link</Text>
        <TextInput
          style={styles.bioInput}
          value={link}
          onChangeText={setLink}
          autoCapitalize="none"
          placeholder="https://google.com"
        />
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  section: {
    margin: 16,
    borderWidth: 1,
    padding: 8,
    borderColor: Colors.border,
    borderRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: "center",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  bioInput: {
    fontWeight: "300",
    fontSize: 13,
    color: "#6e6c68",
  },
});
