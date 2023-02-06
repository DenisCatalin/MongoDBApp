import clientPromise from '../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    const client = await clientPromise;
    const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const collection = db.collection('movies');

    const limit = 20;
    const page = parseInt(req.query.page as string, 10) || 1;

    const result = await collection
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    res.status(200).json(result);
  }
}