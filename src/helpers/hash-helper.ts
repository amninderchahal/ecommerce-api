import { hash, compare } from 'bcryptjs';

export class HashHelper {
    private readonly saltRounds = 10;

    async hashString(stringToHash: string) {
        try {
            return await hash(stringToHash, this.saltRounds);
        } catch (err) {
            console.log(err);
            throw 'Unexpected error occurred';
        }
    }

    async compareHash(candidate, hash) {
        return await compare(candidate, hash);
    }
}
