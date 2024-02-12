import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const search = () => {
  return (
    <View
      style={{
        flex: 1,
        minHeight: "100%",
      }}
    >
      <ImageBackground
        source={{
          uri: "https://images.pexels.com/photos/9222625/pexels-photo-9222625.jpeg?auto=compress&cs=tinysrgb&w=600",
        }}
        className="h-[200px]"
      >
        <Image
          source={{
            uri: "https://images.pexels.com/photos/9222625/pexels-photo-9222625.jpeg?auto=compress&cs=tinysrgb&w=600",
          }}
          style={{
            width:  90,
            height:  90,
            borderRadius:  45, // To keep the image circular
            borderWidth:  2,
            borderColor: 'white',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            bottom:  -0,
            left: '50%',
            marginLeft: -45, // Half of the image width to center it horizontally
            marginTop: 38
          }}
        />
      </ImageBackground>
    </View>
  );
};

export default search;
