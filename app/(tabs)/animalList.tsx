import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { Image, StyleSheet, Text, View } from "react-native";
import {
  FlatList,
  GestureHandlerRootView,
  RefreshControl,
} from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import Animal from "@/interfaces/animal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AnimalList() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    setRefreshing(true);
    fetch("https://animalapi-149569577bed.herokuapp.com/animals")
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        setAnimals(data);
        await AsyncStorage.setItem("animals", JSON.stringify(data));
      })
      .catch((error) => console.error("Error fetching animals:", error))
      .finally(() => setRefreshing(false));
  };

  const loadCachedData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem("animals");
      if (cachedData) {
        setAnimals(JSON.parse(cachedData));
      }
    } catch (error) {
      console.error("error loading cached data:", error);
    }
  };

  useEffect(() => {
    loadCachedData();
    fetchData();
  }, []);

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
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
          }
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
