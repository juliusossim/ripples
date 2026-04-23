import { fireEvent, render, screen } from '@testing-library/react';
import { MediaRenderer } from './media-renderer';

describe('MediaRenderer', () => {
  it('renders an image when the source is an image', () => {
    render(
      <MediaRenderer
        source={{ url: 'https://cdn.example.com/property.jpg', mimeType: 'image/jpeg' }}
        alt="Property exterior"
      />,
    );

    expect(screen.getByAltText('Property exterior')).toBeTruthy();
  });

  it('renders a video with controls when the source is a video', () => {
    render(
      <MediaRenderer
        source={{ url: 'https://cdn.example.com/tour.mp4', mimeType: 'video/mp4' }}
        alt="Property tour"
      />,
    );

    expect(screen.getByLabelText('Property tour')).toBeTruthy();
    expect(screen.getByLabelText('Play')).toBeTruthy();
    expect(screen.getByLabelText('Mute')).toBeTruthy();
    expect(screen.getByLabelText('Fullscreen')).toBeTruthy();
  });

  it('falls back to an image element for unknown media', () => {
    render(
      <MediaRenderer
        source={{ url: 'https://cdn.example.com/asset.unknown' }}
        alt="Unknown asset"
      />,
    );

    expect(screen.getByAltText('Unknown asset')).toBeTruthy();
  });

  it('reveals the play overlay on hover for paused video', () => {
    render(
      <MediaRenderer
        source={{ url: 'https://cdn.example.com/tour.mp4', mimeType: 'video/mp4' }}
        alt="Living room walkthrough"
      />,
    );

    const region = screen.getByLabelText('Video: Living room walkthrough');
    fireEvent.mouseEnter(region);

    expect(screen.getByLabelText('Play video')).toBeTruthy();
  });
});
