const loginFormHandler = async (e) => {
    e.preventDefault();

    const username = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if(username && password){
        const res = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type': 'application/json'}
        });
        
        if(res.ok){
            document.location.replace('/dashboard');
        } else {
            alert(res.statusText)
        }
    }
};

document.querySelector('#login-form').addEventListener('submit', loginFormHandler)