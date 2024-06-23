import Order from "../../domain/entity/order";
import RepositoryInterface from "./repository-interface";

export default interface OrderRepositoryInterface 
    extends RepositoryInterface<Order>{}