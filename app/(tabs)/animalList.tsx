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
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from "@expo/vector-icons";

// TODO: get this value from environment variables, setup for local and production.
// const base_url = "http://192.168.0.101:5000/";

const base_url = "https://animalapi-149569577bed.herokuapp.com";
const api_url =  `${base_url}/animals/`;


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
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json()})
      .then(async (data) => {
        setAnimals(data);
        await AsyncStorage.setItem("animals", JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error fetching animals: ", error)
        alert(`FAIL: ${error.message}`)
      })
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
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('animalClassification', animalClassification);
  
    if (imageUrl) {
      const uriParts = imageUrl.split('.');
      const fileType = uriParts[uriParts.length - 1];
      const imageFile = {
        uri: imageUrl,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      };
      formData.append('imageUrl', imageFile as any);
    }

    fetch(api_url, {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then((response) => {
        
        return {
          response: response.json(),
          ok: response.ok,
          status: response.status,
          responseRaw: response
        }
      })
      .then(async (data: {response: Promise<Animal>,ok: boolean, status: number, responseRaw: Response}) => {
        if(data.ok) setAnimals([...animals, await data.response]);
        else alert('Error code: ' + data.status + JSON.stringify(await data.response));
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  }

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
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
              <Picker.Item label="Select classification" value="" style={styles.pickerItem} />
              <Picker.Item label="Mammals" value="Mammals" style={styles.pickerItem} />
              <Picker.Item label="Birds" value="Birds" style={styles.pickerItem} />
              <Picker.Item label="Reptiles" value="Reptiles" style={styles.pickerItem} />
              <Picker.Item label="Amphibians" value="Amphibians" style={styles.pickerItem}/>
              <Picker.Item label="Fish" value="Fish" style={styles.pickerItem}/>
              <Picker.Item label="Insects" value="Insects" style={styles.pickerItem}/>
              <Picker.Item label="Arachnids" value="Arachnids" style={styles.pickerItem}/>
              <Picker.Item label="Crustaceans" value="Crustaceans" style={styles.pickerItem}/>
            </Picker>
            
            <View style={styles.buttonImage}>
              <TextInput
                placeholder="Image URL"
                value={imageUrl}
                onChangeText={setImageUrl}
                style={styles.inputImage}
                placeholderTextColor={"gray"}
              />
              <FontAwesome.Button name="photo" size={25} color="#aaa" onPress={pickImage} backgroundColor={"#030"} iconStyle={{ marginRight: 0 }} />
              <FontAwesome.Button name="camera" size={25} color="#aaa" onPress={takePhoto} backgroundColor={"#030"} iconStyle={{ marginRight: 0 }} />
                
            </View>
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
  inputImage: {
    width: 100,
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
    paddingTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonImage: {
    display: "flex",
    width: 200,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,

  },
  picker: {
    width: 200,
    height: 60,
    marginBottom: 10,
    color: "white",
  },
  pickerItem: {
    backgroundColor: '#030',
    color: '#bbb'
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    width: 200,
  },
});
