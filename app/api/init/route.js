export async function GET() {
  // 🔥 Use native crypto instead of uuid
  const token = crypto.randomUUID();

  global.tokens = global.tokens || {};

  global.tokens[token] = {
    createdAt: Date.now(),
    used: false
  };

  return Response.json({ token });
}
