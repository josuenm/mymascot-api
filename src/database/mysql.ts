import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(async () => {
    console.log(`🐬 MySQL is running`);
  })
  .catch((error) => console.log(error));
