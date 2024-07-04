import { Sequelize } from "sequelize-typescript";
import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import CustomerModel from "../../../customer/repository/sequilize/customer.model";
import CustomerRepository from "../../../customer/repository/sequilize/customer.repository";

import Product from "../../../../domain/product/entity/product";
import ProductRepository from "../../../../domain/product/repository/product.repository";
import OrderRepository from "./order.repository";

import ProductModel from "../../../product/repository/sequilize/product.model";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Alameda dos Anjos", 1, "066666", "Sao Paulo");
    customer.Address = address

    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product("1", "iPhone", 1000)
    const product2 = new Product("2", "fone", 200)
    await productRepository.create(product)
    await productRepository.create(product2)

    const orderItem = new OrderItem("123", product.name, product.price, product.id, 2)
    const orderItem2 = new OrderItem("124", product2.name, product2.price, product2.id, 2)


    const orderRepository = new OrderRepository();
    const order = new Order("123", customer.id, [orderItem,orderItem2]);
    await orderRepository.create(order)

    order.removeItem(orderItem2.id)

    
   // await productRepository.create(product2)

    //const orderItem2 = new OrderItem("124", product2.name, product2.price, product2.id, 2)


    //order.addItem([orderItem2])
    await orderRepository.update(order)


    const orderModel = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"]
    })


    expect(orderModel.toJSON()).toStrictEqual({
        id: order.id,
        customer_id: "123",
        total: order.total(),
        items: [
            {
                id: orderItem.id,
                name: orderItem.name,
                price: orderItem.price,
                quantity: orderItem.quantity,
                order_id: "123",
                product_id: "1"
            }
           
        ]
    })
})

it("should get all orders", async () => {

    const customerRepository = new CustomerRepository();
    const customer = new Customer("9", "Joao");
    const address = new Address("Street A", 12, "45899", "Rio");
    customer.Address = address;
    await customerRepository.create(customer);

    const productRepository = new ProductRepository()
    const product = new Product("1", "P1", 100)
    const product2 = new Product("12", "P12", 200)
    await productRepository.create(product)
    await productRepository.create(product2)

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem("33", product.name, product.price, product.id, 2)
    const order = new Order("1", customer.id, [orderItem]);
    const orderItem2 = new OrderItem("22", product2.name, product2.price, product2.id, 2)
    const order2 = new Order("2", customer.id, [orderItem2]);

    await orderRepository.create(order2)
    await orderRepository.create(order)

    const orders = await orderRepository.findAll()

    expect(orders.length).toBe(2)

})

it("should get an order", async () => {

    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street A", 12, "45899", "Rio");
    customer.Address = address;
    await customerRepository.create(customer);

    const productRepository = new ProductRepository()
    const product = new Product("1", "P1", 100)
    await productRepository.create(product)

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem("33", product.name, product.price, product.id, 2)
    const order = new Order("1", customer.id, [orderItem]);

    await orderRepository.create(order)

    const orders = await orderRepository.find("1")

    expect(orders).toEqual(order)
})


});








