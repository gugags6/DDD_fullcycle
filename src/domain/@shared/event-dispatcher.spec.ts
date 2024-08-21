import Address from "../customer/value-object/address";
import Customer from "../customer/entity/customer";
import Product from "../product/entity/product";
import CustomerCreatedEvent from "../customer/event/customer-created.event";
import CustomerUpdatedEvent from "../customer/event/customer-updated.event";
import SendEmailWhenProductIsCreatedHandler from "../product/event/handler/send-email-when-product-is-created.handler";
import EventDispatcher from "./event-dispatcher";
import ProductCreatedEvent from "../product/event/product-created.event";
import EnviaConsoleLog1Handler from "../customer/event/handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "../customer/event/handler/envia-console-log2.handler";
import EnviaConsoleLogChangedHandler from "../customer/event/handler/envia-console-log-changed.handler";

describe("Domain events tests",()=>{

    it("should register an event handler", ()=>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should unregister an event handler", ()=>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
        
    });

    it("should unregister all events handler", ()=>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();

    });

    it("should notify all events handler", ()=>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEentHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product1 desc",
            price: 10.1,
        });

        eventDispatcher.notify(productCreatedEvent);

        expect(spyEentHandler).toHaveBeenCalled();

    });

    //Testes do Customer

    it("should register customer created event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const firstEventHandler = new EnviaConsoleLog1Handler();
        const secondEventHandler = new EnviaConsoleLog2Handler();

        eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondEventHandler);
    });

    it("should register customer address changend event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogChangedHandler();

        eventDispatcher.register("CustomerUpdated", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerUpdated"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerUpdated"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerUpdated"][0]).toMatchObject(eventHandler);
    });

    it("should unregister customer created event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const firstEventHandler = new EnviaConsoleLog1Handler();
        const secondEventHandler = new EnviaConsoleLog2Handler();

        eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
    
        eventDispatcher.unregister("CustomerCreatedEvent", firstEventHandler);
    
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
    });

    it("should unregister customer address changend event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogChangedHandler();

        eventDispatcher.register("CustomerUpdated", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerUpdated"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerUpdated"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("CustomerUpdated", eventHandler);
    
        expect(eventDispatcher.getEventHandlers["CustomerUpdated"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerUpdated"].length).toBe(0);
    });

    it("should notify all customer created event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const firstMessageEventHandler = new EnviaConsoleLog1Handler();
        const secondMessageEventHandler = new EnviaConsoleLog2Handler();

        const firstMessageSpyEventHandler = jest.spyOn(firstMessageEventHandler, "handle");
        const secondMessageSpyEventHandler = jest.spyOn(secondMessageEventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", firstMessageEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondMessageEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstMessageEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondMessageEventHandler);

        const customer = new Customer('1', 'Maria');
        const customerCreatedEvent = new CustomerCreatedEvent({ customer });
        
        eventDispatcher.notify(customerCreatedEvent);

        expect(firstMessageSpyEventHandler).toHaveBeenCalled();
        expect(secondMessageSpyEventHandler).toHaveBeenCalled();
    });

    it("should notify customer address changed event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const primeiraMensagemHandler = new EnviaConsoleLog1Handler();
        const segundaMensagemHandler = new EnviaConsoleLog2Handler();
        const addressUpdatedEventHandler = new EnviaConsoleLogChangedHandler();

        const firstMessageCustomerCreatedSpyEventHandler = jest.spyOn(primeiraMensagemHandler, "handle");
        const secondMessageCustomerCreatedSpyEventHandler = jest.spyOn(segundaMensagemHandler, "handle");
        const addressChangedSpyEventHandler = jest.spyOn(addressUpdatedEventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", primeiraMensagemHandler);
        eventDispatcher.register("CustomerCreatedEvent", segundaMensagemHandler);
        eventDispatcher.register("CustomerUpdatedEvent", addressUpdatedEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(primeiraMensagemHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(segundaMensagemHandler);
        expect(eventDispatcher.getEventHandlers["CustomerUpdatedEvent"][0]).toMatchObject(addressUpdatedEventHandler);
    
        const customer = new Customer('1', 'Maria');
        const customerCreatedEvent = new CustomerCreatedEvent({
            customer
        });
        eventDispatcher.notify(customerCreatedEvent);

        const address = new Address('Rua Alameda', 27, '666666', 'São Paulo');
        customer.changeAddress(address);

        const addressChangedEvent = new CustomerUpdatedEvent({ 
            id: customer.id,
            name: customer.name
        });

        eventDispatcher.notify(addressChangedEvent);

        expect(firstMessageCustomerCreatedSpyEventHandler).toHaveBeenCalled();
        expect(secondMessageCustomerCreatedSpyEventHandler).toHaveBeenCalled();
        expect(addressChangedSpyEventHandler).toHaveBeenCalled();
    });

});