"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('📦 Seeding database...');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: 'hashedpassword',
            firstName: 'Admin',
            lastName: 'User',
            phoneNumber: '123456789',
            role: client_1.Role.ADMIN,
            isVerified: true,
        },
    });
    const customer = await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            email: 'customer@example.com',
            password: 'hashedpassword',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '987654321',
            role: client_1.Role.CUSTOMER,
            isVerified: true,
        },
    });
    const car1 = await prisma.car.upsert({
        where: { id: 'car-id-1' },
        update: {},
        create: {
            id: 'car-id-1',
            make: 'Toyota',
            model: 'Camry',
            year: 2022,
            mileage: 15000,
            description: 'A comfortable and fuel-efficient sedan.',
            dailyPrice: 50,
            licensePlate: 'XYZ-123',
            status: client_1.CarStatus.AVAILABLE,
        },
    });
    const car2 = await prisma.car.upsert({
        where: { id: 'car-id-2' },
        update: {},
        create: {
            id: 'car-id-2',
            make: 'Honda',
            model: 'Civic',
            year: 2023,
            mileage: 12000,
            description: 'A stylish and modern sedan with great performance.',
            dailyPrice: 45,
            licensePlate: 'ABC-456',
            status: client_1.CarStatus.RENTED,
        },
    });
    const transaction = await prisma.transaction.create({
        data: {
            amount: 250,
            paymentProvider: client_1.PaymentProvider.STRIPE,
            status: client_1.TransactionStatus.COMPLETED,
            paidAt: new Date(),
        },
    });
    const booking = await prisma.booking.create({
        data: {
            user: {
                connect: { id: customer.id },
            },
            car: {
                connect: { id: car1.id },
            },
            startDate: new Date('2024-03-10'),
            endDate: new Date('2024-03-15'),
            totalPrice: 250,
            status: client_1.BookingStatus.CONFIRMED,
            pickupAddress: '123 Main Street, New York',
            returnAddress: '456 Elm Street, New York',
            transaction: {
                connect: { id: transaction.id },
            },
        },
    });
    await prisma.review.create({
        data: {
            rating: 5,
            comment: 'Great experience! The car was clean and well-maintained.',
            bookingId: booking.id,
            userName: customer.firstName + ' ' + customer.lastName,
            carId: car1.id,
        },
    });
    console.log('✅ Seeding completed!');
}
main()
    .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map