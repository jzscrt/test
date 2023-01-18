import { CreateAnimalDto } from '../dtos/animal.dto';
import { Animal } from '../interfaces/animals.interface';
import animalModel from '../models/animals.model';

class AnimalService {
  public animals = animalModel;

  public async findAllAnimals(): Promise<Animal[]> {
    const animals: Animal[] = this.animals;
    return animals;
  }

  public async getRandomAnimal(): Promise<Animal> {
    const animals: Animal[] = this.animals;
    const max: number = animals.length - 1;
    const rand: number = Math.floor(Math.random() * (max + 1));

    const randomAnimalData: Animal = this.animals[rand];

    return randomAnimalData;
  }

  public async createAnimal(animalData: CreateAnimalDto): Promise<Animal[]> {
    if (!animalData) throw new Error('Invalid animalData');
    if (!Array.isArray(animalData)) throw new Error('animalData is not a list');

    for (let i = 0; i < animalData.length; i++) {
      const findAnimal: Animal = this.animals.find(animal => animal.animal === animalData[i].animal);
      if (findAnimal) throw new Error(`Animal '${animalData[i].animal}' is already listed`);
    }

    const createAnimalData: Animal[] = [];
    for (let i = 0; i < animalData.length; i++) {
      createAnimalData.push({
        id: this.animals.length + i + 1,
        animal: animalData[i].animal,
        color: animalData[i].color,
      });
    }
    this.animals = [...this.animals, ...createAnimalData];

    return createAnimalData;
  }

  public async updateAnimal(id: number, animalData: CreateAnimalDto): Promise<Animal> {
    if (!Object.entries(animalData).length) throw new Error('Invalid animalData');
    let findAnimal: Animal = this.animals.find(animal => animal.id === id);
    if (!findAnimal) throw new Error(`Can't find animal with id: '${id}'`);

    findAnimal = this.animals.find(animal => animal.animal === animalData.animal && animal.color === animalData.color);
    if (findAnimal) throw new Error(`Animal '${animalData.animal}' is already listed`);

    const index: number = this.animals.findIndex(animal => animal.id === id);
    const updateAnimal = this.animals[index];
    this.animals[index] = { ...updateAnimal, ...animalData };

    return this.animals[index];
  }

  public async deleteAnimal(id: number): Promise<Animal> {
    const findAnimal: Animal = this.animals.find(animal => animal.id === id);
    if (!findAnimal) throw new Error(`Can't find animal with id: '${id}'`);

    this.animals = this.animals.filter(animal => animal.id !== id);

    return findAnimal;
  }
}

export default AnimalService;
