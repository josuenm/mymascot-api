import { faker } from "@faker-js/faker";
import { Request, Response } from "express";

export const salesController = (req: Request, res: Response) => {
  const customers = [];

  function createRandomUser() {
    const price = `${faker.datatype.number({
      min: 1,
      max: 9000,
    })}.${faker.datatype.number({ min: 10, max: 99 })}`;

    return {
      id: faker.datatype.uuid(),
      name: faker.internet.userName(),
      email: faker.internet.email(),
      picture: faker.image.avatar(),
      document: faker.datatype.number({ min: 12345678910 }),
      price: Number(price),
      date: faker.date.past(),
    };
  }
  function createRandomUserToday() {
    const price = `${faker.datatype.number({
      min: 1,
      max: 9000,
    })}.${faker.datatype.number({ min: 10, max: 99 })}`;

    return {
      id: faker.datatype.uuid(),
      name: faker.internet.userName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      document: faker.datatype.number({ min: 12345678910 }),
      price: Number(price),
      date: faker.date.recent(),
    };
  }
  function createRandomUserThisMonth() {
    const price = `${faker.datatype.number({
      min: 1,
      max: 9000,
    })}.${faker.datatype.number({ min: 10, max: 99 })}`;

    return {
      id: faker.datatype.uuid(),
      name: faker.internet.userName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      document: faker.datatype.number({ min: 12345678910 }),
      price: Number(price),
      date: faker.date.month(),
    };
  }
  Array.from({ length: 190 }).forEach(() => {
    customers.push(createRandomUser());
  });
  Array.from({ length: 10 }).forEach(() => {
    customers.push(createRandomUserToday());
  });
  Array.from({ length: 50 }).forEach(() => {
    customers.push(createRandomUserThisMonth());
  });

  try {
    return res.json(customers);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err });
  }
};
