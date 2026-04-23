import { fireEvent, render, screen } from '@testing-library/react';
import { testFeedResponse } from '../../auth/testing/auth-test-fixtures';
import { FeedPostCard } from './feed-post-card';

describe('FeedPostCard', () => {
  it('renders a social-style property post', () => {
    render(<FeedPostCard item={testFeedResponse.items[0]} onInteraction={() => undefined} />);

    expect(screen.getByText('Ripples Feed')).toBeTruthy();
    expect(screen.getByText('Waterfront apartment')).toBeTruthy();
    expect(screen.getByText('Why this is surfacing')).toBeTruthy();
  });

  it('toggles the heart state through the product carousel', () => {
    render(<FeedPostCard item={testFeedResponse.items[0]} onInteraction={() => undefined} />);

    fireEvent.click(screen.getByRole('button', { name: 'Like Waterfront apartment' }));
    expect(screen.getByRole('button', { name: 'Unlike Waterfront apartment' })).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Unlike Waterfront apartment' }));
    expect(screen.getByRole('button', { name: 'Like Waterfront apartment' })).toBeTruthy();
  });

  it('tracks actions from the post controls', () => {
    const onInteraction = vi.fn();

    render(<FeedPostCard item={testFeedResponse.items[0]} onInteraction={onInteraction} />);

    fireEvent.click(screen.getByRole('button', { name: 'Like' }));

    expect(onInteraction).toHaveBeenCalledWith('like', 'property_1');
  });

  it('renders carousel navigation when a post has several images', () => {
    const multiMediaItem = {
      ...testFeedResponse.items[0],
      content: {
        ...testFeedResponse.items[0].content,
        media: [
          {
            id: 'media_1',
            url: 'https://example.com/property-1.jpg',
            type: 'image' as const,
            alt: 'Waterfront apartment exterior',
          },
          {
            id: 'media_2',
            url: 'https://example.com/property-2.jpg',
            type: 'image' as const,
            alt: 'Waterfront apartment living room',
          },
        ],
      },
    };

    render(<FeedPostCard item={multiMediaItem} onInteraction={() => undefined} />);

    expect(
      screen.getByRole('button', { name: 'Show next image for Waterfront apartment' }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Show media 2 for Waterfront apartment' }));
    expect(screen.getByAltText('Waterfront apartment living room')).toBeTruthy();
  });

  it('renders event-style posts when the feed item type changes', () => {
    const eventItem = {
      ...testFeedResponse.items[0],
      id: 'event:open-home-1',
      type: 'live-event' as const,
      content: {
        ...testFeedResponse.items[0].content,
        metadata: {
          eventTitle: 'Open home tonight',
          eventStatus: 'Happening now',
          summary: 'Walk through the space live and ask the host questions in real time.',
        },
      },
    };

    render(<FeedPostCard item={eventItem} onInteraction={() => undefined} />);

    expect(screen.getAllByText('Event')).toHaveLength(2);
    expect(screen.getByText('Open home tonight')).toBeTruthy();
  });
});
