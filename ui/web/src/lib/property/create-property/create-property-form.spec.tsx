import { fireEvent, render, screen } from '@testing-library/react';
import { CreatePropertyForm } from './create-property-form';

describe('CreatePropertyForm', () => {
  it('shows a placeholder when no media has been entered', () => {
    renderCreatePropertyForm();

    expect(screen.getByText('Add images or videos to preview the listing media.')).toBeTruthy();
  });

  it('renders a media preview when a valid link is entered', async () => {
    renderCreatePropertyForm();

    fireEvent.change(screen.getByLabelText('Media link'), {
      target: { value: 'https://example.com/property.jpg' },
    });
    fireEvent.change(screen.getByLabelText('Media alt text'), {
      target: { value: 'Sunlit waterfront apartment exterior' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add media link' }));

    expect(await screen.findByAltText('Sunlit waterfront apartment exterior')).toBeTruthy();
  });

  it('shows a helpful validation message when the imported url is invalid', () => {
    renderCreatePropertyForm();

    fireEvent.change(screen.getByLabelText('Media link'), {
      target: { value: 'not-a-valid-url' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add media link' }));

    expect(screen.getByText('Invalid URL')).toBeTruthy();
  });
});

function renderCreatePropertyForm(): ReturnType<typeof render> {
  return render(
    <CreatePropertyForm
      isSubmitting={false}
      onSubmit={async () => undefined}
      onUploadFiles={async () => []}
    />,
  );
}
