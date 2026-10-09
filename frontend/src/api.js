function makeError(message, errors = {}) {
  const err = new Error(message);
  err.errors = errors;
  return err;
}

async function request(path, options) {
  let res;
  try {
    res = await fetch('/api' + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw makeError('Cannot reach the server. Is the backend running?');
  }

  let data = null;
  if (res.status !== 204) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }

  if (!res.ok) throw makeError(data?.error || 'Request failed', data?.errors);
  return data;
}

export const api = {
  list: () => request('/quotes'),
  get: (id) => request('/quotes/' + id),
  create: (body) => request('/quotes', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request('/quotes/' + id, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request('/quotes/' + id, { method: 'DELETE' }),
};
