async function editFormHandler(e) {
    e.preventDefault();
  
    const title = document.querySelector('#post-title').value.trim();
    const post_body = document.querySelector('#post-body').value.trim();
  
    const id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];
  
    const res = await fetch(`/api/posts/edit/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        post_body
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (res.ok) {
      document.location.replace(`/posts/${id}`);
    } else {
      alert("failed to edit post");
    }
  }
  
  document.querySelector('#edit-post-form').addEventListener('submit', editFormHandler);