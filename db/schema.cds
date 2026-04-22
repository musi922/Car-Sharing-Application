namespace com.moyo.carsharing;

using { cuid, managed } from '@sap/cds/common';

type PlateNumber : String(10);
type Currency : String(3);

aspect TechnicalInfo {
    engineType : String;
    fuelConsumption : Decimal(5,2);
    transmission : String enum { Manual; Automatic; };
}

entity Cars : cuid, managed, TechnicalInfo {
    plateNumber : PlateNumber;
    brand : String;
    model : String;
    year : Integer;
    pricePerDay : Decimal(10,2);
    currency : Currency default 'EUR';
    status : String enum { Available; Rented; Maintenance; } default 'Available';
    imageURL: String;
    description: String;
    seats: Integer;
    maxSpeed: Integer;
    fuelType: String;
}

entity Customers : cuid, managed {
    firstName : String;
    lastName : String;
    email : String;
    phoneNumber : String;
}

entity Bookings : cuid, managed {
    car : Association to Cars;
    customer : Association to Customers;
    startDate : Date;
    endDate : Date;
    totalPrice : Decimal(10,2);
    status : String enum { Requested; Confirmed; Completed; Cancelled; } default 'Requested';
}
