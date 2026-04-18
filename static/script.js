document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const langBtns = document.querySelectorAll('.lang-btn');
    const checkBtn = document.getElementById('check-btn');
    const codeEditor = document.getElementById('code-editor');
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    const closeResult = document.getElementById('close-result');
    const supportForm = document.getElementById('support-form');
    const ticketsList = document.getElementById('tickets-list');

    let currentLang = 'python';

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = newTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        
        // Save theme preference
        localStorage.setItem('theme', newTheme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        themeToggle.innerHTML = savedTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    // Language Selection
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = btn.getAttribute('data-lang');
            
            // Update placeholder based on language
            const placeholders = {
                python: 'print("Hello, World!")',
                c: '#include <stdio.h>\nint main() {\n    printf("Hello, World!");\n    return 0;\n}',
                cpp: '#include <iostream>\nint main() {\n    std::cout << "Hello, World!";\n    return 0;\n}',
                java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}'
            };
            codeEditor.placeholder = placeholders[currentLang] || 'Paste your code here...';
        });
    });

    // Error Detection
    checkBtn.addEventListener('click', async () => {
        const code = codeEditor.value.trim();
        if (!code) {
            showResult({ status: 'error', message: 'Please enter some code first!' });
            return;
        }

        checkBtn.disabled = true;
        checkBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

        try {
            const response = await fetch('/api/detect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language: currentLang })
            });
            const data = await response.json();
            showResult(data);
        } catch (error) {
            showResult({ status: 'error', message: 'Failed to connect to the server.' });
        } finally {
            checkBtn.disabled = false;
            checkBtn.innerHTML = '<i class="fas fa-bolt"></i> Check for Errors';
        }
    });

    function showResult(data) {
        resultSection.classList.remove('hidden');
        resultContent.innerHTML = '';
        
        const resultDiv = document.createElement('div');
        resultDiv.className = data.status === 'success' ? 'result-body result-success' : 'result-body result-error';
        
        let content = `<strong>${data.status === 'success' ? '<i class="fas fa-check-circle"></i> Success' : '<i class="fas fa-exclamation-triangle"></i> Error Found'}</strong>`;
        content += `<p>${data.message}</p>`;
        
        if (data.line) {
            content += `<div class="error-details">Line: ${data.line}${data.offset ? ', Column: ' + data.offset : ''}</div>`;
        }
        
        if (data.text) {
            content += `<div class="error-details"><code>${data.text}</code></div>`;
        }

        resultDiv.innerHTML = content;
        resultContent.appendChild(resultDiv);
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    closeResult.addEventListener('click', () => {
        resultSection.classList.add('hidden');
    });

    // Support System
    supportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('support-name').value;
        const email = document.getElementById('support-email').value;
        const message = document.getElementById('support-message').value;

        const submitBtn = supportForm.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const response = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                alert('Message sent successfully!');
                supportForm.reset();
                loadTickets();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            alert('Failed to send message.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });

    async function loadTickets() {
        try {
            const response = await fetch('/api/tickets');
            const tickets = await response.json();
            
            if (tickets.length === 0) {
                ticketsList.innerHTML = '<p class="loading-text">No queries yet.</p>';
                return;
            }

            ticketsList.innerHTML = tickets.map(t => `
                <div class="ticket-item">
                    <div class="ticket-header">
                        <span><strong>${t.name}</strong></span>
                        <span>${t.created_at}</span>
                    </div>
                    <div class="ticket-msg">${t.message}</div>
                </div>
            `).join('');
        } catch (error) {
            ticketsList.innerHTML = '<p class="loading-text">Error loading queries.</p>';
        }
    }

    // Initial load
    loadTickets();
});
