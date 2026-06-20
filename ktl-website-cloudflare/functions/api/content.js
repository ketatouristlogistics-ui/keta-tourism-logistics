// Handles GET/POST for the editable area content (hero text, highlights, focus areas).
// Reads/writes a single JSON blob under the key "area-content" in the bound KV namespace.

export async function onRequestGet(context) {
  const value = await context.env.KTL_KV.get('area-content');
  return new Response(value || 'null', {
    headers: { 'content-type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const body = await context.request.json();
  await context.env.KTL_KV.put('area-content', JSON.stringify(body));
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' }
  });
}
