
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderItemModel from "../../../db/sequelize/model/order-item.model";
import OrderModel from "../../../db/sequelize/model/order.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";


export default class OrderRepository implements OrderRepositoryInterface {
 
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const sequelize = OrderModel.sequelize;
    await sequelize.transaction(async (t) => {
        await OrderItemModel.destroy({
            where: { order_id: entity.id },
            transaction: t,
        });
        const items = entity.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
            order_id: entity.id,
        }));
        await OrderItemModel.bulkCreate(items, { transaction: t });
        await OrderModel.update(
            { total: entity.total() },
            { where: { id: entity.id }, transaction: t }
        );
    });
}
async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ where: { id }, include: ["items"] })
    const items = orderModel.items.map(item => {
        return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
    })
    const order = new Order(orderModel.id, orderModel.customer_id, items)
    return order
}
async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({
        include: [
            { model: OrderItemModel }
        ],
    })

    let order = orders.map(order => {

        const items = order.items.map(item => {
            return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
        })

        return new Order(order.id, order.customer_id, items)
    })
    return order

}
 
}