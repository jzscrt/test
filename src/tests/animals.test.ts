import request from 'supertest';
import assert from 'assert';

import App from '../app';

import { CreateAnimalDto } from '../dtos/animal.dto';
import { Animal } from '../interfaces/animals.interface';
import animalModel from '../models/animals.model';
import AnimalRoute from '../routes/animals.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Animals...', () => {
  describe('[GET] /v1/animals - Get all animals', () => {
    it('response statusCode 200 / allAnimals Success', () => {
      const allAnimals: Animal[] = animalModel;
      const animalRoute = new AnimalRoute();
      const app = new App([animalRoute]);

      return request(app.getServer()).get(`/v1/${animalRoute.path}`).expect(200, { data: allAnimals, message: 'allAnimals' });
    });
  });

  describe('[GET] /v1/animals/random - Get random animal', () => {
    it('response statusCode 200 / randomAnimal Success', () => {
      const animalRoute = new AnimalRoute();
      const app = new App([animalRoute]);

      return request(app.getServer())
        .get(`/v1/${animalRoute.path}/random`)
        .expect(200)
        .then(response => {
          const allAnimals: Animal[] = animalModel;
          const isPresent = allAnimals.some(animal => animal.animal === response.body.data.animal);
          assert.equal(isPresent, true);
        });
    });
  });

  describe('[POST] /v1/animals - Add one (1) animal', () => {
    it('response statusCode 201 / createdAnimal Success', () => {
      const newAnimals: CreateAnimalDto[] = [
        {
          animal: 'Dog',
          color: 'Black',
        },
      ];
      const allAnimals: Animal[] = animalModel;
      const newList: Animal[] = newAnimals.map((animal, index) => {
        return {
          id: allAnimals.length + index + 1,
          animal: animal.animal,
          color: animal.color,
        };
      });
      const animalRoute = new AnimalRoute();
      const app = new App([animalRoute]);

      return request(app.getServer()).post(`/v1/${animalRoute.path}`).send(newAnimals).expect(201, { data: newList, message: 'createdAnimal' });
    });
  });

  describe('[POST] /v1/animals - Add multiple, two (2) animals', () => {
    it('response statusCode 201 / createdAnimal Success', () => {
      const newAnimals: CreateAnimalDto[] = [
        {
          animal: 'Dog',
          color: 'Black',
        },
        {
          animal: 'Turtle',
          color: 'Green',
        },
      ];
      const allAnimals: Animal[] = animalModel;
      const newList: Animal[] = newAnimals.map((animal, index) => {
        return {
          id: allAnimals.length + index + 1,
          animal: animal.animal,
          color: animal.color,
        };
      });
      const animalRoute = new AnimalRoute();
      const app = new App([animalRoute]);

      return request(app.getServer()).post(`/v1/${animalRoute.path}`).send(newAnimals).expect(201, { data: newList, message: 'createdAnimal' });
    });
  });

  describe('[POST] /v1/animals - Add already listed animal', () => {
    it('response statusCode 500 / createdAnimal Error', () => {
      const newAnimals: CreateAnimalDto[] = [
        {
          animal: 'Fox',
          color: 'Red',
        },
      ];
      const animalRoute = new AnimalRoute();
      const app = new App([animalRoute]);

      return request(app.getServer())
        .post(`/v1/${animalRoute.path}`)
        .send(newAnimals)
        .expect(500)
        .then(response => {
          const isPresent = response.text.includes('is already listed');
          assert.equal(isPresent, true);
        });
    });
  });

  describe('[POST] /v1/animals - Empty (null) request body', () => {
    it('response statusCode 500 / createdAnimal Error', () => {
      const newAnimals: CreateAnimalDto[] = null;
      const animalRoute = new AnimalRoute();
      const app = new App([animalRoute]);

      return request(app.getServer())
        .post(`/v1/${animalRoute.path}`)
        .send(newAnimals)
        .expect(500)
        .then(response => {
          const isPresent = response.text.includes('animalData is not a list');
          assert.equal(isPresent, true);
        });
    });
  });

  describe('[PATCH] /v1/animals/:id - Update animal with valid id', () => {
    it('response statusCode 201 / updatedAnimal Success', () => {
      const id = 1;
      const updateAnimal: CreateAnimalDto = {
        animal: 'Fox',
        color: 'Pink',
      };
      const allAnimals: Animal[] = animalModel;
      let findAnimal = allAnimals.find(animal => animal.id === id);
      findAnimal = { ...findAnimal, ...updateAnimal };

      const animalRoute = new AnimalRoute();
      const app = new App([animalRoute]);

      return request(app.getServer())
        .patch(`/v1/${animalRoute.path}/${id}`)
        .send(updateAnimal)
        .expect(200, { data: findAnimal, message: 'updatedAnimal' });
    });
  });

  describe('[PATCH] /v1/animals/:id - Update animal with invalid id', () => {
    it('response statusCode 500 / createdAnimal Error', () => {
      const allAnimals: Animal[] = animalModel;
      const id = allAnimals.length + 1;
      const updateAnimal: CreateAnimalDto = {
        animal: 'Fox',
        color: 'Pink',
      };
      const animalRoute = new AnimalRoute();
      const app = new App([animalRoute]);

      return request(app.getServer())
        .patch(`/v1/${animalRoute.path}/${id}`)
        .send(updateAnimal)
        .expect(500)
        .then(response => {
          const isPresent = response.text.includes(`Can&#39;t find animal with id`);
          assert.equal(isPresent, true);
        });
    });
  });

  describe('[PATCH] /v1/animals/:id - Update animal as duplicate animal', () => {
    it('response statusCode 500 / updatedAnimal Error', () => {
      const id = 1;
      const updateAnimal: CreateAnimalDto = {
        animal: 'Bird',
        color: 'Blue',
      };
      const animalRoute = new AnimalRoute();
      const app = new App([animalRoute]);

      return request(app.getServer())
        .patch(`/v1/${animalRoute.path}/${id}`)
        .send(updateAnimal)
        .expect(500)
        .then(response => {
          const isPresent = response.text.includes('is already listed');
          assert.equal(isPresent, true);
        });
    });
  });

  describe('[PATCH] /v1/animals/:id - Empty (null) request body', () => {
    it('response statusCode 500 / updatedAnimal Error', () => {
      const id = 1;
      const updateAnimal: CreateAnimalDto = null;
      const animalRoute = new AnimalRoute();
      const app = new App([animalRoute]);

      return request(app.getServer())
        .patch(`/v1/${animalRoute.path}/${id}`)
        .send(updateAnimal)
        .expect(500)
        .then(response => {
          const isPresent = response.text.includes('Invalid animalData');
          assert.equal(isPresent, true);
        });
    });
  });

  describe('[DELETE] /v1/animals/:id - Delete animal with valid id', () => {
    it('response statusCode 201 / deletedAnimal Success', () => {
      const id = 1;
      let allAnimals: Animal[] = animalModel;
      const findAnimal = allAnimals.find(animal => animal.id === id);
      allAnimals = allAnimals.filter(animal => animal.id !== id);

      const animalRoute = new AnimalRoute();
      const app = new App([animalRoute]);

      return request(app.getServer())
        .delete(`/v1/${animalRoute.path}/${id}`)
        .expect(200, { data: findAnimal, message: 'deletedAnimal' })
        .then(() => {
          const isPresent = allAnimals.some(animal => animal.id === id);
          assert.equal(isPresent, false);
        });
    });
  });

  describe('[DELETE] /v1/animals/:id - Delete animal with invalid id', () => {
    it('response statusCode 500 / deletedAnimal Error', () => {
      const allAnimals: Animal[] = animalModel;
      const id = allAnimals.length + 1;
      const animalRoute = new AnimalRoute();
      const app = new App([animalRoute]);

      return request(app.getServer())
        .delete(`/v1/${animalRoute.path}/${id}`)
        .expect(500)
        .then(response => {
          const isPresent = response.text.includes(`Can&#39;t find animal with id`);
          assert.equal(isPresent, true);
        });
    });
  });
});
