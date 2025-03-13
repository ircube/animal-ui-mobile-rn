import AnimalClassification from "./AnimalClassification";

export default interface Animal {
  name: string;
  description: string;
  animalClassification: AnimalClassification;
  imageUrl: string;
}
