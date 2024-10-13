import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            const { address, data } = req.body;
            const jsonData = JSON.stringify(data);
            const filePath = path.join(process.cwd(), 'public', `${address}.txt`);
            fs.writeFileSync(filePath, jsonData);
            res.status(200).json({ message: 'Data saved successfully' });
        } catch (err) {
            res.status(405).json({ message: 'Method not allowed in post', err });
        }

    } else if (req.method === 'GET') {
        try {
            const { address } = req.query;
            const filePath = path.join(process.cwd(), 'public', `${address}.txt`);
            const jsonData = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(jsonData);
            res.status(200).json(data);
        } catch (err) {
            res.status(405).json({ message: 'Method not allowed in get', err });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler;