import { SvelteKitAuth } from '@auth/sveltekit';
import {
	SECRET_AUTH_GITHUB_ID,
	SECRET_AUTH_GITHUB_SECRET,
	SECRET_AUTH_SECRET
} from '$env/static/private';
import GitHub from '@auth/sveltekit/providers/github';

export const { handle, signIn, signOut } = SvelteKitAuth(async () => {
	const authOptions = {
		providers: [
			GitHub({
				clientId: SECRET_AUTH_GITHUB_ID,
				clientSecret: SECRET_AUTH_GITHUB_SECRET,
				profile(profile) {
					return {
						id: profile.id.toString(),
						name: profile.name || profile.login,
						email: profile.email,
						image: profile.avatar_url,
						username: profile.login
					};
				}
			})
		],
		callbacks: {
			jwt({ token, profile }) {
				if (profile) token.login = profile.login;
				return token;
			},
			async session({ session, token }) {
				if (session.user && token) {
					session.user.id = token.sub;
					session.user.username = token.login;
				}
				return session;
			}
		},
		secret: SECRET_AUTH_SECRET,
		trustHost: true
	};
	return authOptions;
});
