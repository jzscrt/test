import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import AnimalController from '../controllers/animal.controller';

class AnimalRoute implements Routes {
  public path = '/animal';
  public router = Router();
  public animalController = new AnimalController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/random`, this.animalController.getRandomAnimal);
    this.router.get(this.path, this.animalController.getAnimals);
    this.router.post(this.path, this.animalController.createAnimal);
    this.router.patch(`${this.path}/:id(\\d+)`, this.animalController.updateAnimal);
    this.router.delete(`${this.path}/:id(\\d+)`, this.animalController.deleteAnimal);
  }
}

export default AnimalRoute;
