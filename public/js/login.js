const loginFormHandler = async (e) => {
    e.preventDefault();

    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-long').value.trim();

    if(email && password){
        const res = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({email, password}),
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