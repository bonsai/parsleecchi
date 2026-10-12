export async function onRequestGet(context) {
  const keys = Object.keys(context.env);
  return Response.json({ keys });
}
