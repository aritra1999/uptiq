import { redirect } from '@sveltejs/kit';

export const load = async ({ fetch }) => {
	const user = await fetch('/api/user').then(async (res) => {
		if (!res.ok) {
			return redirect(301, '/');
		}

		return await res.json();
	});
	return { user };
};
