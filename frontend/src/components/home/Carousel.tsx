import { live } from "@/utils";
import { Video } from "expo-av";
import React, { useState } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";

const CarouselWithIndicators = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const slideWidth = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffset / slideWidth);
    setActiveIndex(currentIndex);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {live.map((item, index) => (
          <View style={styles.image} key={index}>
            <Video
              source={{
                uri: item.videoUrl,
              }}
              shouldPlay
            />
            <View style={styles.indicatorsContainer}>
              {live.map((_, index) => (
                <View
                  style={[
                    styles.indicator,
                    activeIndex === index && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.indicatorText}>Your Indicator Text Here</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  image: {
    width,
    height: 200, // Adjust height as per your requirement
    resizeMode: "cover",
    backgroundColor: "#fff",
  },
  indicatorsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: "gray",
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: "#000",
    width: 20,
    height: 6,
  },
  indicatorText: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default CarouselWithIndicators;
