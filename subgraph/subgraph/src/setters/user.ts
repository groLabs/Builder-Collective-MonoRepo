import { User } from '../../generated/schema';
import { Address } from '@graphprotocol/graph-ts';


export const initUser = (
    userAddress: Address
): User => {
    const id = userAddress.toHexString();
    let user = User.load(id);
    if (!user) {
        user = new User(id);
        user.save();
    }
    return user;
}
