import { db } from '@/app/libs/db';
export default async function getLangar(): Promise<any[]> {
    try {
        const langars = await db.langar.findMany();
        return langars;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch langars: ${error.message}`);
        }
        throw new Error('An unknown error occurred while fetching langars.');
    }
}
