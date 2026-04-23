import type { ReactElement } from 'react';
import { MediaUpload } from '@org/ui-media-upload';
import { CreatePropertyFormField } from './create-property-form-field';
import type { CreatePropertyMediaFieldsProps } from './create-property-form.types';

export function CreatePropertyMediaFields({
  disabled,
  error,
  media,
  onChange,
  onUploadFiles,
}: Readonly<CreatePropertyMediaFieldsProps>): ReactElement {
  return (
    <CreatePropertyFormField error={error} id="property-media" label="Listing media">
      <div id="property-media">
        <MediaUpload
          disabled={disabled}
          error={error}
          onChange={onChange}
          onUploadFiles={onUploadFiles}
          value={media}
        />
      </div>
    </CreatePropertyFormField>
  );
}
