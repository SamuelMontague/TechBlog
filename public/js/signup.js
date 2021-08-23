const signupFormHandler = async (e) => {
    e.preventDefault();
  
    const name = document.querySelector('#name-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
  
    if(name && email && password){
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({name, email, password}),
        headers: {'Content-Type': 'application/json'}
      });
  
      if(res.ok){
        document.location.replace('/dashboard');
      } else {
        alert(res.statusText);
      }
    }
  };
  
  document.querySelector('#signup-form').addEventListener('submit', signupFormHandler);