import AnimalClassification from "./AnimalClassification";

export default interface Animal {
  id: string;
  name: string;
  description: string;
  animalClassification: AnimalClassification;
  imageUrl?: string;
  timestamp?: string;
}
