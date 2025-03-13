import {
  Image,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <>
          <ImageBackground
            source={require("@/assets/images/animals/animals.webp")}
            resizeMode="cover"
            style={styles.reactLogo}
          ></ImageBackground>
          <Text style={styles.text}>Animals</Text>
        </>
      }
    >
      <ThemedView style={styles.stepContainer}>
        <TouchableOpacity onPress={() => router.navigate("/(tabs)/animalList")}>
          <Image
            style={styles.stepContainer}
            source={require("@/assets/images/animals/vird.jpeg")}
          />
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Image
          style={styles.stepContainer}
          source={require("@/assets/images/animals/fish.jpg")}
        />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Image
          style={styles.stepContainer}
          source={require("@/assets/images/animals/mammal.jpg")}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    width: "100%",
    height: 250,
    borderRadius: 25,
  },
  reactLogo: {
    flex: 1,
    justifyContent: "center",
    filter: "brightness(60%)",
  },
  text: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
  },
});
