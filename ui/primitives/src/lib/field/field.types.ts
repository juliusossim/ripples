import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { LabelProps } from '../label';

export type FieldLegendVariant = 'legend' | 'label';
export type FieldOrientation = 'vertical' | 'horizontal' | 'responsive';

export type FieldSetProps = Readonly<ComponentPropsWithoutRef<'fieldset'>>;

export type FieldLegendProps = Readonly<
  ComponentPropsWithoutRef<'legend'> & {
    variant?: FieldLegendVariant;
  }
>;

export type FieldGroupProps = Readonly<ComponentPropsWithoutRef<'div'>>;

export type FieldProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    orientation?: FieldOrientation;
  }
>;

export type FieldContentProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type FieldLabelProps = Readonly<LabelProps>;
export type FieldTitleProps = Readonly<ComponentPropsWithoutRef<'div'>>;
export type FieldDescriptionProps = Readonly<ComponentPropsWithoutRef<'p'>>;

export type FieldSeparatorProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    children?: ReactNode;
  }
>;

export type FieldErrorItem = Readonly<{
  message?: string;
}>;

export type FieldErrorProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    errors?: Array<FieldErrorItem | undefined>;
  }
>;
