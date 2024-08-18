import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputCreateProductDto, OutputCreateProductDto } from "./create.product.dto";

  
  export default class CreateProductUseCase {
    private productRepository: ProductRepositoryInterface;
  
    constructor(productRepository: ProductRepositoryInterface) {
      this.productRepository = productRepository;
    }
  
    async execute(
      input: InputCreateProductDto
    ): Promise<OutputCreateProductDto> {
     // const product = new Product("1", "Product 1", 100);
      const product = ProductFactory.create(
        input.type,
        input.name,
        input.price
       
      ) as Product;
  
      await this.productRepository.create(product );
  
      return {
        id: product.id,
        name: product.name,
       price: product.price,
      };
    }
  }