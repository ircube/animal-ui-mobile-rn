import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { Image, StyleSheet, Text, View } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import animals from "@/data/animalList";

export default function AnimalList() {
  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Animals list</ThemedText>
      </ThemedView>
      <GestureHandlerRootView>
        <FlatList
          data={animals}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image
                style={styles.image}
                source={{ uri: item.imageUrl }}
              ></Image>
              <View style={styles.itemText}>
                <Text style={[styles.itemTitle, { flex: 1 }]}>{item.name}</Text>
                <Text
                  numberOfLines={1}
                  style={[styles.itemDescription, { flex: 2 }]}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.name}
        />
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingTop: 40,
    alignItems: "center",
  },

  itemContainer: {
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    padding: 7.5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
    verticalAlign: "middle",
  },
  itemText: {
    flexDirection: "column",
    alignItems: "baseline",
  },
  itemTitle: {
    paddingLeft: 15,
    paddingRight: 10,
    fontSize: 20,
    color: "white",
  },
  itemDescription: {
    paddingLeft: 15,
    paddingRight: 10,
    color: "gray",
    flex: 1,
  },
});
