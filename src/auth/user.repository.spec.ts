import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import { hash } from 'bcryptjs';

const mockCredentialDto = {
  username: 'TestUsername',
  password: 'TestPassword',
};

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save = jest.fn();

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('Sign up successfully', async () => {
      save.mockResolvedValue(undefined);
      userRepository.signUp(mockCredentialDto);
      await expect(
        userRepository.signUp(mockCredentialDto),
      ).resolves.not.toThrow();
    });

    it('Throw conflict exception duplicate username', async () => {
      save.mockRejectedValue({ code: '23505' });
      await expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(
        new ConflictException('Username already exists'),
      );
    });

    it('Throw Internal exception if failed to create user', async () => {
      save.mockRejectedValue({ code: 'error' });
      await expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('Validate User password', () => {
    let user;

    beforeEach(() => {
      user = new User();
      user.username = mockCredentialDto.username;
      user.validatePassword = jest.fn();
      userRepository.findOne = jest.fn().mockReturnValue(user);
    });

    it('Returns username signin if successful', async () => {
      user.validatePassword.mockResolvedValue(true);

      const result = await userRepository.validateUserPassword(
        mockCredentialDto,
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: mockCredentialDto.username,
      });
      expect(user.validatePassword).toHaveBeenCalledWith(
        mockCredentialDto.password,
      );
      expect(result).toEqual(mockCredentialDto.username);
    });

    it('Returns null if user not found', async () => {
      userRepository.findOne.mockReturnValue(null);

      const result = await userRepository.validateUserPassword(
        mockCredentialDto,
      );

      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toEqual(null);
    });

    it('Returns null if password is incorrect', async () => {
      user.validatePassword.mockResolvedValue(false);

      const result = await userRepository.validateUserPassword(
        mockCredentialDto,
      );

      expect(user.validatePassword).toHaveBeenCalled();
      expect(result).toEqual(null);
    });
  });

  describe('Hash password', () => {
    it('Call bcryptjs to has the password', async () => {
      // hash = jest.fn().mockResolvedValue('Test hash');
      // expect(hash).not.toHaveBeenCalled();
      // const result = await userRepository.hashPassword('TestPass', 'TestSalt');
      // // expect(hash).toHaveBeenCalledWith('TestPass', 'TestSalt');
      // expect(result).toEqual('Test hash');
    });
    it('calls bcrypt.hash to generate a hash', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      hash = jest.fn().mockResolvedValue('testHash') as typeof hash;
      expect(hash).not.toHaveBeenCalled();
      const result = await userRepository.hashPassword(
        'testPassword',
        'testSalt',
      );
      expect(hash).toHaveBeenCalledWith('testPassword', 'testSalt');
      expect(result).toEqual('testHash');
    });
  });
});
