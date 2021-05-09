import { User } from './user.entity';
import { compare } from 'bcryptjs';

describe('User Entity', () => {
  let user;

  beforeEach(() => {
    user = new User();
    user.salt = 'Test salt';
    user.password = 'Test password';
  });

  it('Validate Password => True', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    compare = jest.fn().mockReturnValue(true);
    expect(compare).not.toHaveBeenCalled();
    const result = await user.validatePassword(user.password);
    expect(compare).toHaveBeenCalledWith(user.password, user.password);
    expect(result).toEqual(true);
  });

  it('Validate Password => False', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    compare = jest.fn().mockReturnValue(false);
    expect(compare).not.toHaveBeenCalled();
    const result = await user.validatePassword('wrong');
    expect(compare).toHaveBeenCalledWith('wrong', user.password);
    expect(result).toEqual(false);
  });
});
