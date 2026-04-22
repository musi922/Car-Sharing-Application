using { com.moyo.carsharing as my } from '../db/schema';

service CarSharingService {
    entity Cars as projection on my.Cars;
    entity Customers as projection on my.Customers;
    entity Bookings as projection on my.Bookings;

    action cancelBooking(bookingID: UUID) returns String;
    action rentCar(carID: UUID) returns String;
}
