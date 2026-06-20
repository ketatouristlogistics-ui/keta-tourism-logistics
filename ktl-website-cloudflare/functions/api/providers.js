// Handles GET/POST for the service provider directory.
// Reads/writes a single JSON array under the key "providers" in the bound KV namespace.

export async function onRequestGet(context) {
  const value = await context.env.KTL_KV.get('providers');
  return new Response(value || 'null', {
    headers: { 'content-type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const body = await context.request.json();
  await context.env.KTL_KV.put('providers', JSON.stringify(body));
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' }
  });
}
