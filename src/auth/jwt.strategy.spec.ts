import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JwtStrategy', () => {
  let jwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('Validate', () => {
    it('Validate and returns the user based on JWT payload', async () => {
      const user = new User();
      user.username = 'Test user';

      userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({ username: 'Test user' });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'Test user' },
      });
      expect(result).toEqual(user);
    });

    it('Throw unauthorized exception as user has invalid token or expired token', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(
        jwtStrategy.validate({ username: 'invalid' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
