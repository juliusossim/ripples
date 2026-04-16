import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { Property, PropertyInteractionResponse } from '@org/types';
import type { CreatePropertyDto } from './dto/create-property.dto';
import type * as propertyInteractionDto from './dto/property-interaction.dto';
import { PropertyService } from './property.service';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  create(@Body() input: CreatePropertyDto): Promise<Property> {
    return this.propertyService.create(input);
  }

  @Get()
  findMany(): Promise<Property[]> {
    return this.propertyService.findMany();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Property> {
    return this.propertyService.findById(id);
  }

  @Post(':id/view')
  view(
    @Param('id') id: string,
    @Body() input: propertyInteractionDto.PropertyInteractionDto,
  ): Promise<PropertyInteractionResponse> {
    return this.propertyService.trackInteraction(id, input, 'view_property');
  }

  @Post(':id/like')
  like(
    @Param('id') id: string,
    @Body() input: propertyInteractionDto.PropertyInteractionDto,
  ): Promise<PropertyInteractionResponse> {
    return this.propertyService.trackInteraction(id, input, 'like_property');
  }

  @Post(':id/save')
  save(
    @Param('id') id: string,
    @Body() input: propertyInteractionDto.PropertyInteractionDto,
  ): Promise<PropertyInteractionResponse> {
    return this.propertyService.trackInteraction(id, input, 'save_property');
  }

  @Post(':id/share')
  share(
    @Param('id') id: string,
    @Body() input: propertyInteractionDto.PropertyInteractionDto,
  ): Promise<PropertyInteractionResponse> {
    return this.propertyService.trackInteraction(id, input, 'share_property');
  }
}
