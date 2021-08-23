const deleteBtnHandler = async (e) => {
    if(e.target.hasAttribute('data-id')){
      const id = e.target.getAttribute('data-id');
  
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
      });
  
      if(res.ok){
        document.location.replace('/dashboard');
      } else {
        alert('failed to delete post');
      }
    }
  };
  
  document.querySelector('#post-list').addEventListener('click', deleteBtnHandler);