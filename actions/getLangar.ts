import {db} from '@/app/libs/db'
export default async function getLangar() {
    try {
        const langars = await db.langar.findMany({
        });
        return langars

    } catch (error: any) {
        throw new Error(error)

    }
}
