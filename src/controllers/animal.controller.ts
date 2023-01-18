import { NextFunction, Request, Response } from 'express';
import { CreateAnimalDto } from '../dtos/animal.dto';
import { Animal } from '../interfaces/animals.interface';
import animalService from '../services/animals.service';

class AnimalController {
  public animalService = new animalService();

  public getAnimals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllAnimals: Animal[] = await this.animalService.findAllAnimals();

      res.status(200).json({ data: findAllAnimals, message: 'allAnimals' });
    } catch (error) {
      next(error.message);
    }
  };

  public getRandomAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const getRandomAnimal: Animal = await this.animalService.getRandomAnimal();

      res.status(200).json({ data: getRandomAnimal, message: 'randomAnimal' });
    } catch (error) {
      next(error.message);
    }
  };

  public createAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const animalData: CreateAnimalDto = req.body;
      const createAnimalData: Animal[] = await this.animalService.createAnimal(animalData);

      res.status(201).json({ data: createAnimalData, message: 'createdAnimal' });
    } catch (error) {
      next(error.message);
    }
  };

  public updateAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const animalData: CreateAnimalDto = req.body;
      const updateAnimalData: Animal = await this.animalService.updateAnimal(id, animalData);

      res.status(200).json({ data: updateAnimalData, message: 'updatedAnimal' });
    } catch (error) {
      next(error.message);
    }
  };

  public deleteAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const deleteAnimalData: Animal = await this.animalService.deleteAnimal(id);

      res.status(200).json({ data: deleteAnimalData, message: 'deletedAnimal' });
    } catch (error) {
      next(error.message);
    }
  };
}

export default AnimalController;
