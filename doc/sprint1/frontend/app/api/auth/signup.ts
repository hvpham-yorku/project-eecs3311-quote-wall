import { hash } from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  await dbConnect();

  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = await hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({ message: "User created", userId: newUser._id });
}
