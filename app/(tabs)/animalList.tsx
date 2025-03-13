import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import {
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  FlatList,
  GestureHandlerRootView,
  RefreshControl,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import Animal from "@/interfaces/animal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

// TODO: get this value from environment variables, setup for local and production.
const api_url = "https://animalapi-149569577bed.herokuapp.com/animals";

export default function AnimalList() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [animalClassification, setAnimalClassification] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const fetchData = () => {
    setRefreshing(true);
    fetch(api_url)
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        setAnimals(data);
        await AsyncStorage.setItem("animals", JSON.stringify(data));
      })
      .catch((error) => console.error("Error fetching animals: ", error))
      .finally(() => setRefreshing(false));
  };

  const loadCachedData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem("animals");
      if (cachedData) {
        setAnimals(JSON.parse(cachedData));
      }
    } catch (error) {
      console.error("Error loading cached data: ", error);
    }
  };

  const postAnimal = async () => {
    if (!name || !description || !animalClassification) {
      setError("Name, Description and Animal Classification are required");
      return;
    }

    fetch(api_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, animalClassification }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        setAnimals([...animals, data]);
        setModalVisible(false);
        setName("");
        setDescription("");
        setImageUrl("");
        setAnimalClassification("");
        setError("");
        setModalVisible(false);
      })
      .catch((error) => {
        console.error("Error posting animal: ", error);
      });
  };

  useEffect(() => {
    loadCachedData();
    fetchData();
  }, []);

  return (
    <GestureHandlerRootView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Animals list</ThemedText>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={32} color="#bbb" />
        </TouchableOpacity>
      </ThemedView>
      <FlatList
        endFillColor={"#030"}
        data={animals}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image style={styles.image} source={{ uri: item.imageUrl }}></Image>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor={"gray"}
            />
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              placeholderTextColor={"gray"}
            />
            <Picker
              selectedValue={animalClassification}
              onValueChange={(itemValue) => setAnimalClassification(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select classification" value="" />
              <Picker.Item label="Mammals" value="Mammals" />
              <Picker.Item label="Birds" value="Birds" />
              <Picker.Item label="Reptiles" value="Reptiles" />
              <Picker.Item label="Amphibians" value="Amphibians" />
              <Picker.Item label="Fish" value="Fish" />
              <Picker.Item label="Insects" value="Insects" />
              <Picker.Item label="Arachnids" value="Arachnids" />
              <Picker.Item label="Crustaceans" value="Crustaceans" />
            </Picker>
            <TextInput
              placeholder="Image URL"
              value={imageUrl}
              onChangeText={setImageUrl}
              style={styles.input}
              placeholderTextColor={"gray"}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                color={"#020"}
                onPress={() => setModalVisible(false)}
              />
              <Button title="Submit" color={"#060"} onPress={postAnimal} />
            </View>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    display: "flex",
    height: 100,
    paddingTop: 40,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    backgroundColor: "#030",
  },
  itemContainer: {
    backgroundColor: "#020",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#030",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
  },
  input: {
    width: 200,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "white",
  },
  buttonRow: {
    display: "flex",
    width: 200,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  picker: {
    width: 200,
    height: 60,
    marginBottom: 10,
    color: "white",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    width: 200,
  },
});
