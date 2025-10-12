import { User } from '@/entities/models/user';

export function userPresenter(user: User) {
    return {
        id: user.id,
        uuid: user.uuid,
        score: user.score,
        countryId: user.countryId,
    };
}
