import { NextApiRequest, NextApiResponse } from "next";
const { createClient } = require("@astrajs/collections");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const astraClient = await createClient({
    astraDatabaseId: process.env.ASTRA_DB_ID,
    astraDatabaseRegion: process.env.ASTRA_DB_REGION,
    applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN,
  });

  const membersCollection = astraClient
    .namespace("nextjs")
    .collection("members");

  if (req.method === "POST") {
    const { body } = req;
    const member = {
      name: body.name,
      location: body.location,
      github: body.github,
    };

    const data = await membersCollection.create(member);
    res.status(201).json({ id: data.documentId, ...member });

    return;
  }

  const { data, status } = await membersCollection.find({});
  res
    .status(status)
    .json(Object.keys(data).map((key) => ({ id: key, ...data[key] })));
}
