class LoginManager {
    constructor() {
        this.loginButton = document.getElementById('login-btn');
        this.messageElement = document.getElementById('message');
        this.initEventListeners();
    }

    setLoading(loading) {
        this.loginButton.disabled = loading;
        this.loginButton.innerHTML = loading ? 'Logging in... <span class="loader"></span>' : 'Log In';
    }

    async displayMessage(message, isError = false) {
        this.messageElement.textContent = message;
        this.messageElement.style.color = isError ? 'red' : 'green';
        this.messageElement.style.opacity = 1;
        this.messageElement.style.display = 'block';
        setTimeout(() => this.fadeOutMessage(), 3000);
    }

    fadeOutMessage() {
        this.messageElement.style.opacity = 0;
        setTimeout(() => this.messageElement.style.display = 'none', 300);
    }

    validateLoginForm(username, password) {
        if (username.trim() === '' || password.trim() === '') {
            this.displayMessage('Please enter both username and password.', true);
            return false;
        }
        return true;
    }

    async handleLogin(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!this.validateLoginForm(username, password)) {
            return;
        }

        this.setLoading(true);
        try {
            const response = await this.performLoginRequest(username, password);
            this.handleLoginResponse(response);
        } catch (error) {
            console.error('Error during login:', error);
            this.displayMessage('An error occurred. Please try again later.', true);
        } finally {
            this.setLoading(false);
        }
    }

    async performLoginRequest(username, password) {
        return await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ username, password }),
        });
    }

    async handleLoginResponse(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.success) {
            this.displayMessage('Login successful. Redirecting...');
            window.location.href = '/dashboard.html';
        } else {
            this.displayMessage('Login failed. Please check your credentials.', true);
        }
    }

    initEventListeners() {
        document.getElementById('login-form').addEventListener('submit', this.handleLogin.bind(this));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});
