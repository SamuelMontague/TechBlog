const newPostHandler = async (e) => {
    e.preventDefault();
  
    const title = document.querySelector('#post-title').value.trim();
    const post_body = document.querySelector('#post-body').value.trim();
  
    if(title && post_body){
      const res = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({title, post_body}),
        headers: {'Content-Type': 'application/json'}
      });
  
      if(res.ok){
        document.location.replace('/dashboard');
      } else {
        alert('failed to post content');
      }
    }
  };
  
  document.querySelector('#new-post-form').addEventListener('submit', newPostHandler);