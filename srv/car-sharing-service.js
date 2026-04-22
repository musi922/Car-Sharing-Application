import cds from '@sap/cds';

export default cds.service.impl(async function () {
    const { Bookings, Cars } = this.entities;

    // Calculate total price before creating a booking
    this.before('CREATE', 'Bookings', async (req) => {
        const { car_ID, startDate, endDate } = req.data;
        if (!car_ID || !startDate || !endDate) return;

        const car = await SELECT.one.from(Cars).where({ ID: car_ID });
        if (!car) return req.error(404, `Car with ID ${car_ID} not found`);

        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        req.data.totalPrice = diffDays * car.pricePerDay;
    });

    // Custom action to cancel a booking
    this.on('cancelBooking', async (req) => {
        const { bookingID } = req.data;
        const n = await UPDATE(Bookings).set({ status: 'Cancelled' }).where({ ID: bookingID });
        if (n > 0) return `Booking ${bookingID} cancelled successfully`;
        return req.error(404, `Booking ${bookingID} not found`);
    });

    // Custom action to rent a car
    this.on('rentCar', async (req) => {
        const { carID } = req.data;
        const n = await UPDATE(Cars).set({ status: 'Rented' }).where({ ID: carID });
        if (n > 0) return `Car ${carID} rented successfully`;
        return req.error(404, `Car ${carID} not found`);
    });
});
