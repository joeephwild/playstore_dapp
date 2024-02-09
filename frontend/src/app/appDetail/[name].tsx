import {
  View,
  Text,
  ImageBackground,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { apps } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const Details = () => {
  const { name } = useLocalSearchParams();
  const [appDetals, setAppDetails] = useState<{
    image: any;
    title: string;
    type: string;
    rating: number;
    size: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetails = async () => {
      const result = apps.filter((app) => app.title === name);
      console.log(result);
      setAppDetails(result[0]);
      setLoading(false); // Set loading to false after fetching data
    };
    getDetails();
  }, [name]); // Depend on 'name' instead of 'appDetals' to avoid infinite loop

  return (
    <View style={{ flex: 1, minHeight: "100%" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <ImageBackground
            source={{
              uri: "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=600",
            }}
            style={{ height: 200, width: "100%" }}
          >
            <SafeAreaView
              style={{
                padding: 8,
              }}
            >
              <Ionicons
                onPress={() => router.back()}
                name="arrow-back"
                size={24}
                color="#fff"
              />
            </SafeAreaView>
          </ImageBackground>

          <View style={{ marginTop: 40, paddingHorizontal: 9 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 16,
                height: 92
              }}
            >
              <Image
                source={
                  appDetals && appDetals.image
                    ? appDetals.image
                    : "https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=600"
                }
                style={{ width: 92, height: 92 }}
              />
              <View
                style={{
                  gap: 8,
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 20,
                    color: "#fff",
                    fontWeight: "700",
                    width: 216,
                  }}
                >
                  {appDetals.title}
                </Text>
                <Text
                  style={{
                    color: "#0B95FF",
                    fontWeight: "700",
                  }}
                >
                  Activision Publishing, Inc.
                </Text>
                <Text   style={{
                    color: "#fff",
                    fontSize:10,
                    fontWeight: "400"
                  }} >
                  Contains ads <Ionicons name="pin-outline" color="#fffs" /> In-app purchases with BNB
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default Details;
