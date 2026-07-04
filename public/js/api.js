const token = () => localStorage.getItem("token");

async function request(url, options = {}) {
  const res = await fetch(API + url, {
    headers: {
      ...(options.body && { "Content-Type": "application/json" }),
      ...(token() && { Authorization: "Bearer " + token() })
    },
    ...options
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

// PROJECTS
export const getProjects = (page) =>
  request(`/projects?page=${page}`);

export const getProject = (id) =>
  request(`/projects/${id}`);

export const likeProject = (id) =>
  request(`/projects/${id}/like`, { method: "PUT" });

// COMMENTS
export const getComments = (id, page = 1) =>
  request(`/projects/${id}/comments?page=${page}`);


export const addComment = (id, text) =>
  request(`/projects/${id}/comment`, {
    method: "POST",
    body: JSON.stringify({ text })
  });


export const deleteComment = (id, commentId) =>
  request(`/projects/${id}/comment/${commentId}`, {
    method: "DELETE"
  });

export const updateComment = (id, commentId, text) =>
  request(`/projects/${id}/comment/${commentId}`, {
    method: "PUT",
    body: JSON.stringify({ text })
  });