import { fireEvent, render, screen } from '@testing-library/react';
import { testFeedResponse } from '../../auth/testing/auth-test-fixtures';
import { PropertyCard } from './property-card';

describe('PropertyCard', () => {
  it('renders image media for a property listing', () => {
    render(<PropertyCard item={testFeedResponse.items[0]} onInteraction={() => undefined} />);

    expect(screen.getByAltText('Waterfront apartment exterior')).toBeTruthy();
    expect(screen.getByText('Waterfront apartment')).toBeTruthy();
  });

  it('renders video media through MediaRenderer when the listing media is a video', () => {
    const item = {
      ...testFeedResponse.items[0],
      content: {
        ...testFeedResponse.items[0].content,
        media: [
          {
            id: 'media_video_1',
            url: 'https://example.com/property-tour.mp4',
            type: 'video' as const,
            alt: 'Waterfront apartment tour',
          },
        ],
      },
    };

    render(<PropertyCard item={item} onInteraction={() => undefined} />);

    expect(screen.getByLabelText('Waterfront apartment tour')).toBeTruthy();
    expect(screen.getByLabelText('Play')).toBeTruthy();
  });

  it('calls the interaction handler for card actions', () => {
    const onInteraction = vi.fn();

    render(<PropertyCard item={testFeedResponse.items[0]} onInteraction={onInteraction} />);

    fireEvent.click(screen.getByRole('button', { name: 'Like' }));

    expect(onInteraction).toHaveBeenCalledWith('like', 'property_1');
  });
});
