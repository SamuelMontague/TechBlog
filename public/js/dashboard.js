const newFormHandler = async (event) => {
  event.preventDefault();

  const title= document.querySelector('#post-title').value.trim();
  const post_body = document.querySelector('#post-body').value.trim();

  if (title && post_body) {
    const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: JSON.stringify({title, post_body }),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to post content');
    }
  }
};

const newCommentHandler = async (event) => {
    event.preventDefault();

    const comment_body = document.querySelector(' #comment-body').value.trim()

    if(comment_body){
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({comment_body}),
            headers: {'Content-Type' : 'application/json'}
        })

        if (response.ok) {
            document.location.replace('/dashboard');
          } else {
            alert('Failed to comment content');
          }
    }
}

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to delete project');
    }
  }
};

document.querySelector('#new-post-form').addEventListener('submit', newFormHandler);

document.querySelector('#post-list').addEventListener('submit', newCommentHandler);

document.querySelector('#new-comment-form').addEventListener('click', delButtonHandler);
