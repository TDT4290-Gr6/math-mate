import { User } from '@/entities/models/user';

/**
 * Formats a single `User` entity for presentation purposes.
 *
 * @param user - The `User` object to be presented.
 * @returns An object containing the key properties of the user, suitable for returning to clients or APIs.
 *
 * @example
 * const user = {
 *   id: 1,
 *   uuid: '12345-uuid-from-nextauth',
 *   score: 4.2,
 *   countryId: 3
 * };
 * const presented = userPresenter(user);
 * // presented: {
 * //   id: 1,
 * //   uuid: '12345-uuid-from-nextauth',
 * //   score: 4.2,
 * //   countryId: 3
 * // }
 */
export function userPresenter(user: User) {
    return {
        id: user.id,
        uuid: user.uuid,
        score: user.score,
        countryId: user.countryId,
    };
}
