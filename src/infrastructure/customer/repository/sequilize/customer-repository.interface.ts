import RepositoryInterface from "../../../../domain/@shared/repository/repository-interface";
import Customer from "../../../../domain/customer/entity/customer";


export default interface CustomerRepositoryInterface 
    extends RepositoryInterface<Customer>{}