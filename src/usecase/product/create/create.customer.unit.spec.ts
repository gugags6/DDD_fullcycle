import CreateProductUseCase from "./create.product.usacase";


const input = {
    type:"a",
    name: "John",
    price:20.5
   
  };
  
  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
  };
  
  describe("Unit test create product use case", () => {
    it("should create a product", async () => {
      const productRepository = MockRepository();
      const productCreateUseCase = new CreateProductUseCase(productRepository);
  
      const output = await productCreateUseCase.execute(input);
  
      expect(output).toEqual({
        id: expect.any(String),
        name: input.name,
        price: input.price,
      });
    });
  
 
  
  });