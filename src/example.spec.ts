class FriendsList {
  friends = [];

  addFriend(name) {
    this.friends.push(name);
    this.announceFriendship(name);
  }

  announceFriendship(name) {
    global.console.log(`${name} is now a friend`);
  }

  removeFriend(name) {
    const idx = this.friends.indexOf(name);

    if (idx === -1) throw new Error('Friend not found');

    this.friends.splice(idx, 1);
  }
}

describe('Friends List', () => {
  let friendsList;

  beforeEach(() => {
    friendsList = new FriendsList();
  });

  it('Initialize friends list', () => {
    expect(friendsList.friends.length).toEqual(0);
  });

  it('Add a friend to friends list', () => {
    friendsList.addFriend('Champ');
    expect(friendsList.friends.length).toEqual(1);
  });

  it('Announce friendship', () => {
    friendsList.announceFriendship = jest.fn();
    expect(friendsList.announceFriendship).not.toHaveBeenCalled();
    friendsList.addFriend('Champ');
    expect(friendsList.announceFriendship).toHaveBeenCalledWith('Champ');
  });

  describe('removeFriend', () => {
    it('Remove success', () => {
      friendsList.addFriend('Champ');
      expect(friendsList.friends[0]).toEqual('Champ');
      friendsList.removeFriend('Champ');
      expect(friendsList.friends[0]).toBeUndefined();
    });
    it('Remove failed', () => {
      expect(() => friendsList.removeFriend('Champ')).toThrowError(
        'Friend not found',
      );
    });
  });
});
