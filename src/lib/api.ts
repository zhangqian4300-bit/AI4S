const API_BASE_URL = '/api';

export const translateText = async (text: string) => {
  const response = await fetch(`${API_BASE_URL}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
};

export const uploadFile = async (file: File) => {
  const form = new FormData();
  form.append('file', file);
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: form,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.data;
};

export const chatWithRole = async (role: string, context: string, messages: Array<{ role: 'user' | 'assistant', content: string }>) => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role, context, messages }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.data;
};
