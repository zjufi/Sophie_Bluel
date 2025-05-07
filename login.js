document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
        const response = await fetch('http://localhost:5678/api/users/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email,password})
        });

        if (response.ok) {
        const data = await response.json();
        sessionStorage. setItem('token', data.token);
        window.location.href = 'index.html';
        } else {
        alert('Identifiant invalides.');
        }
        } catch (error) {
        alert('Erreur lors de la connexion.');
        }
        });
    }); 

    