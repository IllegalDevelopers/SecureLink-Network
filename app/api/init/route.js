import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const token = uuidv4();

  global.tokens = global.tokens || {};

  global.tokens[token] = {
    createdAt: Date.now(),
    used: false
  };

  return Response.json({ token });
}
