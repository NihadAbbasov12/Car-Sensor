import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { NormalizedCarRecord } from "./types";

export async function persistCar(car: NormalizedCarRecord) {
  return prisma.$transaction(async (transaction) => {
    const savedCar = await transaction.car.upsert({
      where: { sourceId: car.sourceId },
      update: {
        sourceUrl: car.sourceUrl,
        title: car.title,
        brand: car.brand,
        model: car.model,
        year: car.year,
        mileageKm: car.mileageKm,
        priceJpy: car.priceJpy,
        totalPriceJpy: car.totalPriceJpy,
        bodyType: car.bodyType,
        fuelType: car.fuelType,
        transmission: car.transmission,
        drive: car.drive,
        engineCc: car.engineCc,
        color: car.color,
        location: car.location,
        rawData: car.rawData as Prisma.InputJsonValue,
      },
      create: {
        sourceId: car.sourceId,
        sourceUrl: car.sourceUrl,
        title: car.title,
        brand: car.brand,
        model: car.model,
        year: car.year,
        mileageKm: car.mileageKm,
        priceJpy: car.priceJpy,
        totalPriceJpy: car.totalPriceJpy,
        bodyType: car.bodyType,
        fuelType: car.fuelType,
        transmission: car.transmission,
        drive: car.drive,
        engineCc: car.engineCc,
        color: car.color,
        location: car.location,
        rawData: car.rawData as Prisma.InputJsonValue,
      },
    });

    await transaction.carImage.deleteMany({
      where: { carId: savedCar.id },
    });

    if (car.images.length > 0) {
      await transaction.carImage.createMany({
        data: car.images.map((url, index) => ({
          carId: savedCar.id,
          url,
          sortOrder: index,
        })),
      });
    }

    return savedCar;
  });
}
