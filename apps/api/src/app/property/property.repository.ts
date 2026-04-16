import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  MediaType,
  Prisma,
  PropertyListingStatus as PrismaPropertyListingStatus,
} from '@prisma/client';
import type { Media, Property } from '@org/types';
import { PrismaService } from '../database/prisma.service';
import type { CreatePropertyDto, PropertyMediaDto } from './dto/create-property.dto';

type PropertyListingRecord = Prisma.PropertyListingGetPayload<{
  include: {
    media: {
      orderBy: {
        sortOrder: 'asc';
      };
    };
  };
}>;

@Injectable()
export class PropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreatePropertyDto): Promise<Property> {
    const location = this.normalizeLocation(input.location);
    const price = this.normalizePrice(input.price);
    const media = input.media.map((item, index) => this.normalizeMedia(item, index));
    const property = await this.prisma.propertyListing.create({
      data: {
        title: input.title.trim(),
        description: input.description.trim(),
        city: location.city,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
        priceAmount: price.amount,
        priceCurrency: price.currency,
        status: this.toPrismaStatus(input.status ?? 'active'),
        media: {
          create: media.map((item, index) => ({
            url: item.url,
            type: this.toPrismaMediaType(item.type),
            alt: item.alt,
            sortOrder: index,
          })),
        },
      },
      include: this.includeMedia(),
    });

    return this.toProperty(property);
  }

  async findMany(): Promise<Property[]> {
    const properties = await this.prisma.propertyListing.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: this.includeMedia(),
    });

    return properties.map((property) => this.toProperty(property));
  }

  async findActive(): Promise<Property[]> {
    const properties = await this.prisma.propertyListing.findMany({
      where: {
        status: PrismaPropertyListingStatus.active,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: this.includeMedia(),
    });

    return properties.map((property) => this.toProperty(property));
  }

  async findById(id: string): Promise<Property> {
    const property = await this.prisma.propertyListing.findUnique({
      where: { id },
      include: this.includeMedia(),
    });
    if (!property) {
      throw new NotFoundException(`Property ${id} was not found.`);
    }

    return this.toProperty(property);
  }

  private includeMedia(): { readonly media: { readonly orderBy: { readonly sortOrder: 'asc' } } } {
    return {
      media: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
    };
  }

  private normalizeLocation(input: unknown): Property['location'] {
    const value = this.expectRecord(input, 'location');
    const latitude = value.latitude;
    const longitude = value.longitude;

    return {
      city: this.expectString(value.city, 'location.city'),
      country: this.expectString(value.country, 'location.country'),
      latitude:
        latitude === undefined ? undefined : this.expectNumber(latitude, 'location.latitude'),
      longitude:
        longitude === undefined ? undefined : this.expectNumber(longitude, 'location.longitude'),
    };
  }

  private normalizePrice(input: unknown): Property['price'] {
    const value = this.expectRecord(input, 'price');
    const amount = this.expectNumber(value.amount, 'price.amount');
    const currency = this.expectString(value.currency, 'price.currency');

    if (amount <= 0) {
      throw new BadRequestException('price.amount must be greater than zero.');
    }
    if (currency.length !== 3) {
      throw new BadRequestException('price.currency must be a three-letter currency code.');
    }

    return {
      amount,
      currency: currency.toUpperCase(),
    };
  }

  private normalizeMedia(input: PropertyMediaDto, index: number): Omit<Media, 'id'> {
    const value = this.expectRecord(input, `media.${index}`);
    const type = value.type;

    if (type !== 'image' && type !== 'video') {
      throw new BadRequestException(`media.${index}.type must be image or video.`);
    }

    return {
      url: this.expectString(value.url, `media.${index}.url`),
      type,
      alt: this.expectString(value.alt, `media.${index}.alt`),
    };
  }

  private toProperty(property: PropertyListingRecord): Property {
    return {
      id: property.id,
      title: property.title,
      description: property.description,
      location: {
        city: property.city,
        country: property.country,
        latitude: property.latitude ?? undefined,
        longitude: property.longitude ?? undefined,
      },
      price: {
        amount: property.priceAmount,
        currency: property.priceCurrency,
      },
      media: property.media.map((item) => ({
        id: item.id,
        url: item.url,
        type: item.type,
        alt: item.alt,
      })),
      status: this.toPublicStatus(property.status),
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };
  }

  private toPrismaStatus(status: Property['status']): PrismaPropertyListingStatus {
    if (status === 'under-offer') {
      return PrismaPropertyListingStatus.under_offer;
    }

    return status as PrismaPropertyListingStatus;
  }

  private toPublicStatus(status: PrismaPropertyListingStatus): Property['status'] {
    return status === PrismaPropertyListingStatus.under_offer ? 'under-offer' : status;
  }

  private toPrismaMediaType(type: Media['type']): MediaType {
    return type === 'video' ? MediaType.video : MediaType.image;
  }

  private expectRecord(value: unknown, field: string): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException(`${field} must be an object.`);
    }

    return value as Record<string, unknown>;
  }

  private expectString(value: unknown, field: string): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`${field} must be a non-empty string.`);
    }

    return value.trim();
  }

  private expectNumber(value: unknown, field: string): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new BadRequestException(`${field} must be a finite number.`);
    }

    return value;
  }
}
