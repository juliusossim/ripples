import { useIsMobile } from './hooks';

describe('ui hooks exports', () => {
  it('should export useIsMobile', () => {
    expect(useIsMobile).toBeDefined();
  });
});
