import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequilize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequilize/product.repository";
import CreateProductUseCase from "./create.product.usacase";
import ProductFactory from "../../../domain/product/factory/product.factory";
import productRepository from "../../../infrastructure/product/repository/sequilize/product.repository";
import Product from "../../../domain/product/entity/product";

describe('Test create product use case', () => {
    let sequelize: Sequelize
      beforeEach( async () => {
        sequelize = new Sequelize({
          dialect: 'sqlite',
          storage: ':memory',
          logging: false,
          sync: { force: true },
        })
  
      await sequelize.addModels([ProductModel]);
      await sequelize.sync()
      })
  
      afterEach( async () => {
        await sequelize.close()
      })
  
    it('Should create a product', async () => {
      const repository = new ProductRepository()
      const usecase = new CreateProductUseCase(repository)

     

     // await repository.create(product );

      const input = {
        type: "a",
        name: "Michel",
        price: 22
      };

      const output = await usecase.execute(input);
      
    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    })
  })

     
  
  })