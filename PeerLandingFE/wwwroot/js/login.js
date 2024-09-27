async function submitLogin() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/ApiLogin/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            localStorage.setItem('jwtToken', result.data.token);
            if (response.ok) {
                const token = result.data.token;
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('userId', result.data.userId);

                const jwtPayload = JSON.parse(atob(token.split('.')[1]));
                console.log(jwtPayload);
                const role = jwtPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                console.log(role);

                if (role === 'admin') {
                    window.location.href = '/home/index';
                } else if (role === 'borrower') {
                    window.location.href = '/borrowerLoan/index';
                } else {
                    alert('Unauthorized role.');
                }
            } else {
                alert(result.message || 'Login failed. Please try again.');
            }
        } else {
            alert(result.message || 'Login failed. Please try again.');
        }
    }
    catch (error) {
        alert('An error occured while logging in: ' + error.message)
    }
}