import type { AuthConfigService } from './auth-config.service';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  it('hashes and verifies passwords with the configured pepper', async () => {
    const service = new PasswordService(createConfig('pepper-one'));
    const password = 'Correct1!';
    const result = await service.hash(password);

    expect(result.hash).not.toBe(password);
    expect(result.salt).toHaveLength(22);
    await expect(service.verify(password, result.salt, result.hash)).resolves.toBe(true);
  });

  it('rejects passwords derived with a different pepper', async () => {
    const password = 'Correct1!';
    const result = await new PasswordService(createConfig('pepper-one')).hash(password);

    await expect(
      new PasswordService(createConfig('pepper-two')).verify(password, result.salt, result.hash),
    ).resolves.toBe(false);
  });

  it('rejects stored hashes with an invalid length', async () => {
    const service = new PasswordService(createConfig('pepper-one'));

    await expect(service.verify('Correct1!', 'stored-salt', 'short')).resolves.toBe(false);
  });
});

function createConfig(passwordPepper: string): AuthConfigService {
  return { passwordPepper } as AuthConfigService;
}
