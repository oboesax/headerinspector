const express = require("express");
const router = new express.Router();

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function syntaxHighlight(json) {
    const tokenRegex = /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;
    let result = '';
    let lastIndex = 0;

    json.replace(tokenRegex, (match, _p1, _p2, _p3, _p4, offset) => {
        // Escape and append any text before this match (braces, commas, whitespace)
        result += escapeHtml(json.slice(lastIndex, offset));
        lastIndex = offset + match.length;

        let cls = 'json-number';
        if (/^"/.test(match)) {
            cls = /:$/.test(match) ? 'json-key' : 'json-string';
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }

        result += `<span class="${cls}">${escapeHtml(match)}</span>`;
    });

    // Append any remaining text after the last match
    result += escapeHtml(json.slice(lastIndex));
    return result;
}

function generateHTML(data) {
    const prettyJson = JSON.stringify(data, null, 2);
    const highlighted = syntaxHighlight(prettyJson);
    const rawJsonEscaped = escapeHtml(prettyJson);

    return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTTP Header Inspector</title>
    <style>
        :root {
            --transition-speed: 0.3s;
        }
        [data-theme="dark"] {
            --bg-primary: #1e1e1e;
            --bg-secondary: #252526;
            --bg-tertiary: #2d2d2d;
            --text-primary: #d4d4d4;
            --text-secondary: #808080;
            --border-color: #404040;
            --accent: #569cd6;
            --header-bg: #181818;
            --key-color: #9cdcfe;
            --string-color: #ce9178;
            --number-color: #b5cea8;
            --boolean-color: #569cd6;
            --btn-bg: #3c3c3c;
            --btn-hover: #505050;
        }
        [data-theme="light"] {
            --bg-primary: #ffffff;
            --bg-secondary: #f5f5f5;
            --bg-tertiary: #e8e8e8;
            --text-primary: #1e1e1e;
            --text-secondary: #6e6e6e;
            --border-color: #d4d4d4;
            --accent: #0066b8;
            --header-bg: #f0f0f0;
            --key-color: #0451a5;
            --string-color: #a31515;
            --number-color: #098658;
            --boolean-color: #0000ff;
            --btn-bg: #e0e0e0;
            --btn-hover: #c8c8c8;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            transition: background var(--transition-speed), color var(--transition-speed);
            line-height: 1.6;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: var(--header-bg);
            border-bottom: 1px solid var(--border-color);
            transition: background var(--transition-speed), border-color var(--transition-speed);
        }
        header h1 {
            font-size: 1.3rem;
            font-weight: 600;
        }
        .theme-toggle {
            background: var(--btn-bg);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 6px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: background var(--transition-speed), border-color var(--transition-speed), color var(--transition-speed);
        }
        .theme-toggle:hover {
            background: var(--btn-hover);
        }
        .ip-display {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 16px 20px;
            margin: 20px 0;
            transition: background var(--transition-speed), border-color var(--transition-speed);
        }
        .ip-display .label {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-secondary);
            margin-bottom: 4px;
        }
        .ip-display .ip {
            font-size: 1.4rem;
            font-weight: 600;
            font-family: "Cascadia Code", "Fira Code", "Consolas", monospace;
            color: var(--accent);
        }
        .section {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
            transition: background var(--transition-speed), border-color var(--transition-speed);
        }
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 20px;
            background: var(--bg-tertiary);
            border-bottom: 1px solid var(--border-color);
            transition: background var(--transition-speed), border-color var(--transition-speed);
        }
        .section-header h2 {
            font-size: 0.95rem;
            font-weight: 600;
        }
        .copy-btn {
            background: var(--btn-bg);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 4px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: background var(--transition-speed), border-color var(--transition-speed), color var(--transition-speed);
        }
        .copy-btn:hover {
            background: var(--btn-hover);
        }
        pre {
            padding: 16px 20px;
            overflow-x: auto;
            font-family: "Cascadia Code", "Fira Code", "Consolas", monospace;
            font-size: 0.85rem;
            line-height: 1.5;
        }
        .json-key { color: var(--key-color); }
        .json-string { color: var(--string-color); }
        .json-number { color: var(--number-color); }
        .json-boolean, .json-null { color: var(--boolean-color); }
    </style>
</head>
<body>
    <header>
        <h1>HTTP Header Inspector</h1>
        <button class="theme-toggle" id="themeToggle">Light Mode</button>
    </header>
    <div class="container">
        <div class="ip-display">
            <div class="label">Your IP Address</div>
            <div class="ip">${escapeHtml(data.clientIp)}</div>
        </div>
        <div class="section">
            <div class="section-header">
                <h2>Formatted JSON</h2>
            </div>
            <pre>${highlighted}</pre>
        </div>
        <div class="section">
            <div class="section-header">
                <h2>Raw JSON</h2>
                <button class="copy-btn" id="copyBtn">Copy</button>
            </div>
            <pre id="rawJson">${rawJsonEscaped}</pre>
        </div>
    </div>
    <script>
        (function() {
            var rawJson = ${JSON.stringify(prettyJson).replace(/</g, '\\u003c')};
            var themeToggle = document.getElementById('themeToggle');
            var copyBtn = document.getElementById('copyBtn');

            function setTheme(theme) {
                document.documentElement.setAttribute('data-theme', theme);
                themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
                localStorage.setItem('theme', theme);
            }

            var saved = localStorage.getItem('theme');
            if (saved) {
                setTheme(saved);
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                setTheme('light');
            }

            themeToggle.addEventListener('click', function() {
                var current = document.documentElement.getAttribute('data-theme');
                setTheme(current === 'dark' ? 'light' : 'dark');
            });

            copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(rawJson).then(function() {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(function() { copyBtn.textContent = 'Copy'; }, 2000);
                });
            });
        })();
    </script>
</body>
</html>`;
}

router.get("/", (req, res) => {
    const data = {
        clientIp: req.ip,
        httpVersion: req.httpVersion,
        headers: req.headers,
    };

    if (req.accepts(["json", "html"]) === "html") {
        res.type("html").send(generateHTML(data));
    } else {
        res.json(data);
    }
});

module.exports = router;
