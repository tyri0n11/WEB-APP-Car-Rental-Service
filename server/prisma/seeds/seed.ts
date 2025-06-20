import { PrismaClient, CarStatus, FuelType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories first
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'SUV' },
      update: {},
      create: { name: 'SUV' },
    }),
    prisma.category.upsert({
      where: { name: 'Sedan' },
      update: {},
      create: { name: 'Sedan' },
    }),
    prisma.category.upsert({
      where: { name: 'Sports' },
      update: {},
      create: { name: 'Sports' },
    }),
    prisma.category.upsert({
      where: { name: 'Luxury' },
      update: {},
      create: { name: 'Luxury' },
    }),
    prisma.category.upsert({
      where: { name: 'Electric' },
      update: {},
      create: { name: 'Electric' },
    }),
  ]);

  // Car data with realistic Vietnamese prices (in VND)
  const cars = [
    {
      make: 'Toyota',
      model: 'RAV4',
      year: 2022,
      kilometers: 15000,
      description: 'Spacious SUV perfect for family trips',
      dailyPrice: 1200000, // Standard SUV
      licensePlate: 'ABC123',
      numSeats: 5,
      address: '123 Main St, City',
      autoGearbox: true,
      fuelType: FuelType.HYBRID,
      status: CarStatus.AVAILABLE,
      categories: ['SUV'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      kilometers: 5000,
      description: 'Modern electric sedan with impressive range',
      dailyPrice: 2500000, // Premium electric vehicle
      licensePlate: 'XYZ789',
      numSeats: 5,
      address: '456 Electric Ave, City',
      autoGearbox: true,
      fuelType: FuelType.ELECTRIC,
      status: CarStatus.AVAILABLE,
      categories: ['Electric', 'Sedan'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'BMW',
      model: 'M3',
      year: 2022,
      kilometers: 20000,
      description: 'High-performance sports sedan',
      dailyPrice: 3000000, // Luxury sports car
      licensePlate: 'SPT456',
      numSeats: 5,
      address: '789 Speed St, City',
      autoGearbox: true,
      fuelType: FuelType.PETROL,
      status: CarStatus.AVAILABLE,
      categories: ['Sports', 'Luxury'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Mercedes-Benz',
      model: 'S-Class',
      year: 2023,
      kilometers: 3000,
      description: 'Luxury sedan with premium comfort',
      dailyPrice: 4000000, // High-end luxury sedan
      licensePlate: 'LUX789',
      numSeats: 5,
      address: '101 Luxury Lane, City',
      autoGearbox: true,
      fuelType: FuelType.PETROL,
      status: CarStatus.AVAILABLE,
      categories: ['Luxury', 'Sedan'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Porsche',
      model: '911',
      year: 2022,
      kilometers: 10000,
      description: 'Iconic sports car with exceptional performance',
      dailyPrice: 5000000, // Premium sports car
      licensePlate: 'SPT911',
      numSeats: 4,
      address: '202 Sports Blvd, City',
      autoGearbox: true,
      fuelType: FuelType.PETROL,
      status: CarStatus.AVAILABLE,
      categories: ['Sports', 'Luxury'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Audi',
      model: 'Q5',
      year: 2023,
      kilometers: 8000,
      description: 'Premium SUV with advanced technology',
      dailyPrice: 2200000, // Premium SUV
      licensePlate: 'AUD456',
      numSeats: 5,
      address: '303 Tech Ave, City',
      autoGearbox: true,
      fuelType: FuelType.DIESEL,
      status: CarStatus.AVAILABLE,
      categories: ['SUV', 'Luxury'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Volkswagen',
      model: 'Golf',
      year: 2022,
      kilometers: 25000,
      description: 'Reliable and efficient compact car',
      dailyPrice: 800000, // Economy car
      licensePlate: 'VW789',
      numSeats: 5,
      address: '404 Compact St, City',
      autoGearbox: true,
      fuelType: FuelType.PETROL,
      status: CarStatus.AVAILABLE,
      categories: ['Sedan'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Ford',
      model: 'Mustang',
      year: 2023,
      kilometers: 5000,
      description: 'Classic American muscle car',
      dailyPrice: 3500000, // Premium sports car
      licensePlate: 'MUS789',
      numSeats: 4,
      address: '505 Muscle Ave, City',
      autoGearbox: true,
      fuelType: FuelType.PETROL,
      status: CarStatus.AVAILABLE,
      categories: ['Sports'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Hyundai',
      model: 'Tucson',
      year: 2022,
      kilometers: 18000,
      description: 'Modern SUV with great value',
      dailyPrice: 1000000, // Standard SUV
      licensePlate: 'HYU456',
      numSeats: 5,
      address: '606 Value St, City',
      autoGearbox: true,
      fuelType: FuelType.PETROL,
      status: CarStatus.AVAILABLE,
      categories: ['SUV'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Nissan',
      model: 'Leaf',
      year: 2023,
      kilometers: 3000,
      description: 'Popular electric vehicle with great range',
      dailyPrice: 1800000, // Electric car
      licensePlate: 'NIS789',
      numSeats: 5,
      address: '707 Electric Blvd, City',
      autoGearbox: true,
      fuelType: FuelType.ELECTRIC,
      status: CarStatus.AVAILABLE,
      categories: ['Electric', 'Sedan'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Lexus',
      model: 'RX',
      year: 2022,
      kilometers: 12000,
      description: 'Luxury SUV with hybrid technology',
      dailyPrice: 2800000, // Luxury SUV
      licensePlate: 'LEX456',
      numSeats: 5,
      address: '808 Luxury Ave, City',
      autoGearbox: true,
      fuelType: FuelType.HYBRID,
      status: CarStatus.AVAILABLE,
      categories: ['SUV', 'Luxury'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Chevrolet',
      model: 'Corvette',
      year: 2023,
      kilometers: 2000,
      description: 'High-performance sports car',
      dailyPrice: 5500000, // Premium sports car
      licensePlate: 'COR789',
      numSeats: 4,
      address: '909 Speed St, City',
      autoGearbox: true,
      fuelType: FuelType.PETROL,
      status: CarStatus.AVAILABLE,
      categories: ['Sports', 'Luxury'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Volvo',
      model: 'XC90',
      year: 2022,
      kilometers: 15000,
      description: 'Safe and comfortable luxury SUV',
      dailyPrice: 3200000, // Premium SUV
      licensePlate: 'VOL456',
      numSeats: 7,
      address: '1010 Safety Ave, City',
      autoGearbox: true,
      fuelType: FuelType.HYBRID,
      status: CarStatus.AVAILABLE,
      categories: ['SUV', 'Luxury'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Mazda',
      model: 'MX-5',
      year: 2023,
      kilometers: 4000,
      description: 'Fun and agile convertible sports car',
      dailyPrice: 2300000, // Sports car
      licensePlate: 'MAZ789',
      numSeats: 4,
      address: '1111 Fun St, City',
      autoGearbox: true,
      fuelType: FuelType.PETROL,
      status: CarStatus.AVAILABLE,
      categories: ['Sports'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Kia',
      model: 'EV6',
      year: 2023,
      kilometers: 6000,
      description: 'Modern electric crossover',
      dailyPrice: 2000000, // Electric SUV
      licensePlate: 'KIA456',
      numSeats: 5,
      address: '1212 Electric Ave, City',
      autoGearbox: true,
      fuelType: FuelType.ELECTRIC,
      status: CarStatus.AVAILABLE,
      categories: ['Electric', 'SUV'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Subaru',
      model: 'Outback',
      year: 2022,
      kilometers: 22000,
      description: 'Reliable all-wheel drive wagon',
      dailyPrice: 1500000, // Standard SUV/wagon
      licensePlate: 'SUB789',
      numSeats: 5,
      address: '1313 Adventure St, City',
      autoGearbox: true,
      fuelType: FuelType.PETROL,
      status: CarStatus.AVAILABLE,
      categories: ['SUV'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Jaguar',
      model: 'F-Type',
      year: 2023,
      kilometers: 3000,
      description: 'British luxury sports car',
      dailyPrice: 4500000, // Premium sports car
      licensePlate: 'JAG456',
      numSeats: 4,
      address: '1414 British Ave, City',
      autoGearbox: true,
      fuelType: FuelType.PETROL,
      status: CarStatus.AVAILABLE,
      categories: ['Sports', 'Luxury'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Land Rover',
      model: 'Range Rover',
      year: 2022,
      kilometers: 10000,
      description: 'Premium luxury SUV with off-road capability',
      dailyPrice: 4800000, // Premium luxury SUV
      licensePlate: 'RNG789',
      numSeats: 5,
      address: '1515 Luxury Blvd, City',
      autoGearbox: true,
      fuelType: FuelType.DIESEL,
      status: CarStatus.AVAILABLE,
      categories: ['SUV', 'Luxury'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Porsche',
      model: 'Taycan',
      year: 2023,
      kilometers: 5000,
      description: 'High-performance electric sports car',
      dailyPrice: 5200000, // Premium electric sports car
      licensePlate: 'POR456',
      numSeats: 4,
      address: '1616 Electric St, City',
      autoGearbox: true,
      fuelType: FuelType.ELECTRIC,
      status: CarStatus.AVAILABLE,
      categories: ['Electric', 'Sports', 'Luxury'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
    {
      make: 'Audi',
      model: 'RS e-tron GT',
      year: 2023,
      kilometers: 4000,
      description: 'High-performance electric luxury sedan',
      dailyPrice: 5800000, // Premium electric luxury car
      licensePlate: 'AUD789',
      numSeats: 5,
      address: '1717 Performance Ave, City',
      autoGearbox: true,
      fuelType: FuelType.ELECTRIC,
      status: CarStatus.AVAILABLE,
      categories: ['Electric', 'Luxury', 'Sedan'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60',
          isMain: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60',
          isMain: false,
        },
      ],
    },
  ];

  // Create cars with their categories and images
  for (const carData of cars) {
    const { categories: categoryNames, images, ...carInfo } = carData;

    const car = await prisma.car.upsert({
      where: { licensePlate: carInfo.licensePlate },
      update: carInfo,
      create: carInfo,
    });

    // Create car categories
    for (const categoryName of categoryNames) {
      const category = categories.find((c) => c.name === categoryName);
      if (category) {
        await prisma.carCategory.upsert({
          where: {
            carId_categoryId: {
              carId: car.id,
              categoryId: category.id,
            },
          },
          update: {},
          create: {
            carId: car.id,
            categoryId: category.id,
          },
        });
      }
    }

    // Create car images
    await prisma.carImage.deleteMany({ where: { carId: car.id } });

    // Then add all images
    for (const imageData of images) {
      await prisma.carImage.create({
        data: {
          ...imageData,
          carId: car.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
