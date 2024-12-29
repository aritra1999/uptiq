const demoStatuses = [
	{
		status: 'up',
		responseTime: 103,
		statusCode: 200,
		createdAt: '2024-10-22 17:55:07'
	},
	{
		status: 'up',
		responseTime: 80,
		statusCode: 200,
		createdAt: '2024-10-22 17:50:07'
	},
	{
		status: 'up',
		responseTime: 152,
		statusCode: 200,
		createdAt: '2024-10-22 17:45:14'
	},
	{
		status: 'up',
		responseTime: 111,
		statusCode: 200,
		createdAt: '2024-10-22 17:40:08'
	},
	{
		status: 'up',
		responseTime: 115,
		statusCode: 200,
		createdAt: '2024-10-22 17:35:06'
	},
	{
		status: 'up',
		responseTime: 96,
		statusCode: 200,
		createdAt: '2024-10-22 17:30:08'
	},
	{
		status: 'up',
		responseTime: 71,
		statusCode: 200,
		createdAt: '2024-10-22 17:25:06'
	},
	{
		status: 'up',
		responseTime: 107,
		statusCode: 200,
		createdAt: '2024-10-22 17:20:04'
	},
	{
		status: 'up',
		responseTime: 111,
		statusCode: 200,
		createdAt: '2024-10-22 17:15:06'
	},
	{
		status: 'up',
		responseTime: 108,
		statusCode: 200,
		createdAt: '2024-10-22 17:10:05'
	},
	{
		status: 'up',
		responseTime: 110,
		statusCode: 200,
		createdAt: '2024-10-22 17:05:06'
	},
	{
		status: 'up',
		responseTime: 110,
		statusCode: 200,
		createdAt: '2024-10-22 17:00:15'
	},
	{
		status: 'up',
		responseTime: 110,
		statusCode: 200,
		createdAt: '2024-10-22 16:55:07'
	},
	{
		status: 'up',
		responseTime: 60,
		statusCode: 200,
		createdAt: '2024-10-22 16:50:06'
	},
	{
		status: 'up',
		responseTime: 100,
		statusCode: 200,
		createdAt: '2024-10-22 16:45:05'
	},
	{
		status: 'up',
		responseTime: 106,
		statusCode: 200,
		createdAt: '2024-10-22 16:40:08'
	},
	{
		status: 'up',
		responseTime: 95,
		statusCode: 200,
		createdAt: '2024-10-22 16:35:06'
	},
	{
		status: 'up',
		responseTime: 77,
		statusCode: 200,
		createdAt: '2024-10-22 16:30:13'
	},
	{
		status: 'up',
		responseTime: 100,
		statusCode: 200,
		createdAt: '2024-10-22 16:25:05'
	},
	{
		status: 'up',
		responseTime: 121,
		statusCode: 200,
		createdAt: '2024-10-22 16:20:07'
	},
	{
		status: 'up',
		responseTime: 105,
		statusCode: 200,
		createdAt: '2024-10-22 16:15:05'
	},
	{
		status: 'up',
		responseTime: 120,
		statusCode: 200,
		createdAt: '2024-10-22 16:10:07'
	},
	{
		status: 'up',
		responseTime: 53,
		statusCode: 200,
		createdAt: '2024-10-22 16:05:05'
	},
	{
		status: 'up',
		responseTime: 83,
		statusCode: 200,
		createdAt: '2024-10-22 16:00:07'
	},
	{
		status: 'up',
		responseTime: 161,
		statusCode: 200,
		createdAt: '2024-10-22 15:55:07'
	},
	{
		status: 'up',
		responseTime: 169,
		statusCode: 200,
		createdAt: '2024-10-22 15:50:07'
	},
	{
		status: 'up',
		responseTime: 188,
		statusCode: 200,
		createdAt: '2024-10-22 15:45:07'
	},
	{
		status: 'up',
		responseTime: 109,
		statusCode: 200,
		createdAt: '2024-10-22 15:40:09'
	},
	{
		status: 'up',
		responseTime: 116,
		statusCode: 200,
		createdAt: '2024-10-22 15:35:07'
	},
	{
		status: 'up',
		responseTime: 111,
		statusCode: 200,
		createdAt: '2024-10-22 15:30:09'
	},
	{
		status: 'up',
		responseTime: 101,
		statusCode: 200,
		createdAt: '2024-10-22 15:25:04'
	},
	{
		status: 'up',
		responseTime: 118,
		statusCode: 200,
		createdAt: '2024-10-22 15:20:06'
	},
	{
		status: 'up',
		responseTime: 95,
		statusCode: 200,
		createdAt: '2024-10-22 15:15:11'
	},
	{
		status: 'up',
		responseTime: 115,
		statusCode: 200,
		createdAt: '2024-10-22 15:10:11'
	},
	{
		status: 'up',
		responseTime: 72,
		statusCode: 200,
		createdAt: '2024-10-22 15:05:09'
	},
	{
		status: 'up',
		responseTime: 94,
		statusCode: 200,
		createdAt: '2024-10-22 15:00:26'
	},
	{
		status: 'up',
		responseTime: 118,
		statusCode: 200,
		createdAt: '2024-10-22 14:55:06'
	},
	{
		status: 'up',
		responseTime: 71,
		statusCode: 200,
		createdAt: '2024-10-22 14:50:09'
	},
	{
		status: 'up',
		responseTime: 127,
		statusCode: 200,
		createdAt: '2024-10-22 14:45:08'
	},
	{
		status: 'up',
		responseTime: 83,
		statusCode: 200,
		createdAt: '2024-10-22 14:40:07'
	},
	{
		status: 'up',
		responseTime: 95,
		statusCode: 200,
		createdAt: '2024-10-22 14:35:07'
	},
	{
		status: 'up',
		responseTime: 91,
		statusCode: 200,
		createdAt: '2024-10-22 14:30:08'
	},
	{
		status: 'up',
		responseTime: 84,
		statusCode: 200,
		createdAt: '2024-10-22 14:25:05'
	},
	{
		status: 'up',
		responseTime: 103,
		statusCode: 200,
		createdAt: '2024-10-22 14:20:07'
	},
	{
		status: 'up',
		responseTime: 93,
		statusCode: 200,
		createdAt: '2024-10-22 14:05:05'
	},
	{
		status: 'up',
		responseTime: 81,
		statusCode: 200,
		createdAt: '2024-10-22 14:00:11'
	},
	{
		status: 'up',
		responseTime: 93,
		statusCode: 200,
		createdAt: '2024-10-22 13:55:10'
	},
	{
		status: 'up',
		responseTime: 148,
		statusCode: 200,
		createdAt: '2024-10-22 13:50:07'
	},
	{
		status: 'up',
		responseTime: 110,
		statusCode: 200,
		createdAt: '2024-10-22 13:45:05'
	},
	{
		status: 'up',
		responseTime: 114,
		statusCode: 200,
		createdAt: '2024-10-22 13:40:15'
	}
];

export const load = async ({ fetch }) => {
	const website = {
		id: '6fb1dcea-ad27-477e-ba0d-efd96c5e68c7',
		name: 'Uptiq',
		url: 'https://uptiq.vercel.app'
	};

	const statuses = demoStatuses;

	return {
		website,
		statuses
	};
};
