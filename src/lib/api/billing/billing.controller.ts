import { verifyAuth } from '@hono/auth-js';
import { Hono, type Context } from 'hono';
import { getUser } from '../user/user.service';
import { getAllProjects } from '../projects/projects.service';
import { MAX_PROJECTS_FREE, MAX_WEBSITES_PER_PROJECT_FREE } from '../costants';
import { getWebsiteCount } from '../websites/websites.service';
import { SECRET_STRIPE_WEBHOOK_KEY } from '$env/static/private';
import { downgradeUserWithSubscription, upgrageUserPlan } from './billing.service';
import { stripe } from '$lib/stripe/stripe';

export const billingRouter = new Hono();

export const downgradePlanController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const user = await getUser(String(token.id));
	if (!user) return context.status(404);

	if (!user.pro)
		return context.json({ error: 'Free plan already activated for user' }, { status: 400 });

	const projects = await getAllProjects(String(token.id));
	if (projects && projects.length > MAX_PROJECTS_FREE)
		return context.json(
			{
				error: `You have more than ${MAX_PROJECTS_FREE} projects, you need to delete some projects before downgrading`
			},
			{ status: 400 }
		);

	for (const project of projects) {
		const countOfWebsites = await getWebsiteCount(project.id);
		if (countOfWebsites > MAX_WEBSITES_PER_PROJECT_FREE) {
			return context.json(
				{
					error: `You have more than ${MAX_WEBSITES_PER_PROJECT_FREE} websites in project ${project.name}, you need to delete some websites before downgrading`
				},
				{ status: 400 }
			);
		}
	}

	if (!user.stripeSubscriptionId)
		return context.json({ error: 'User does not have a subscription' }, { status: 400 });

	await downgradeUserWithSubscription(user.stripeSubscriptionId);

	return context.json({ success: true });
};

export const upgradeWobhookController = async (context: Context) => {
	const signature = context.req.header('stripe-signature');

	try {
		if (!signature) {
			return context.text('', 400);
		}
		const body = await context.req.text();
		const event = await stripe.webhooks.constructEventAsync(
			body,
			signature,
			SECRET_STRIPE_WEBHOOK_KEY
		);

		switch (event.type) {
			case 'invoice.paid': {
				const email = event.data.object.customer_email;
				const subscription = event.data.object.subscription as string;
				if (!email || !subscription)
					return context.text(
						'Error extracting information, please send and email to aritra.uptiq@gmail.com',
						400
					);
				await upgrageUserPlan(email, subscription);
				break;
			}
			case 'customer.subscription.deleted': {
				const subscription = await stripe.subscriptions.retrieve(event.data.object.id);
				await downgradeUserWithSubscription(subscription.id);
				break;
			}
			default:
				break;
		}
		return context.text('', 200);
	} catch (err) {
		const errorMessage = `⚠️  Webhook signature verification failed. ${
			err instanceof Error ? err.message : 'Internal server error'
		}`;
		console.log(errorMessage);
		return context.text(errorMessage, 400);
	}
};

export const downgradeWobhookController = async (context: Context) => {
	return context.json({ success: true });
};

billingRouter.post('/webhook', upgradeWobhookController);
billingRouter.get('/cancel', verifyAuth(), downgradePlanController);
