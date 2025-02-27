import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";

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
  const [image, setImage] = useState(imgUrl || "");

  console.log({
    bio,
    link,
    userId,
    image,
  });

  return (
    <View>
      <Text>Page</Text>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({});