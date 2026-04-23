import type { UseMutationResult } from '@tanstack/react-query';
import type {
  CreatePropertyRequest,
  Property,
  PropertyInteractionRequest,
  PropertyInteractionResponse,
  UploadedMediaAsset,
} from '@org/types';

export type CreatePropertyMutationResult = UseMutationResult<
  Property,
  Error,
  CreatePropertyRequest
>;

export type UploadMediaMutationResult = UseMutationResult<UploadedMediaAsset[], Error, File[]>;

export type PropertyInteractionName = 'like' | 'save' | 'share' | 'view';

export interface PropertyInteractionMutationInput {
  readonly propertyId: string;
  readonly interaction: PropertyInteractionName;
  readonly payload: PropertyInteractionRequest;
}

export type PropertyInteractionMutationResult = UseMutationResult<
  PropertyInteractionResponse,
  Error,
  PropertyInteractionMutationInput
>;
