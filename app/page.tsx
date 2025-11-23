import { redirect } from 'next/navigation';

/**
 * HomePage
 *
 * Server-side page that immediately redirects users to the protected
 * start page. This acts as a default landing route for the application.
 *
 * @async
 * @function
 * @returns {Promise<void>} Performs a redirect and does not render any content.
 */
export default async function HomePage() {
    redirect('/protected/start');
}
