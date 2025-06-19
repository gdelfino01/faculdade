import User from '../models/user';
import bcrypt from 'bcrypt';

async function createDefaultUsers(): Promise<void> {
	const userCount: number = await User.count();

	if (userCount === 0) {
		console.log('Creating default user...');

		const hashedPassword: string = await bcrypt.hash('adminpassword', 10);

		await User.create({
			name: 'Administrator',
			email: 'admin@email.com',
			password: hashedPassword,
			role: 'admin',
		});

		console.log('Admin user created successfully');
	} else console.log('Admin user already exists');
}

export default createDefaultUsers;