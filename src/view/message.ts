import DOMPurify from "dompurify";
import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";

@customElement('a-message')
export class Message extends LitElement {
  // Public reactive properties
  @property({ type: String })
  accessor role: 'user' | 'assistant' | 'system' = 'user';

  @property({ type: String })
  accessor content: string = '';

  // Internal state for processed content
  @state()
  private accessor _processedContent: string = '';

  // Static styles for the component
  static styles = css`
    :host {
      display: block;
      margin: 8px 0;
    }

    .message {
      padding: 12px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
    }

    .message.user {
      background-color: #e3f2fd;
      margin-left: 20%;
    }

    .message.assistant {
      background-color: #f5f5f5;
      margin-right: 20%;
    }

    .message.system {
      background-color: #fff3e0;
      font-style: italic;
      text-align: center;
    }

    .role {
      font-weight: 600;
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 4px;
    }

    .content {
      color: #333;
    }

    /* Markdown-specific styles */
    .content h1, .content h2, .content h3, .content h4, .content h5, .content h6 {
      margin: 0.5em 0 0.25em 0;
      color: #222;
    }

    .content p {
      margin: 0.5em 0;
    }

    .content code {
      background-color: rgba(0, 0, 0, 0.1);
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9em;
    }

    .content pre {
      background-color: #f8f8f8;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 12px;
      overflow-x: auto;
      margin: 0.5em 0;
    }

    .content pre code {
      background: none;
      padding: 0;
    }

    .content blockquote {
      border-left: 4px solid #ddd;
      padding-left: 16px;
      margin: 0.5em 0;
      color: #666;
      font-style: italic;
    }

    .content ul, .content ol {
      margin: 0.5em 0;
      padding-left: 24px;
    }

    .content a {
      color: #1976d2;
      text-decoration: none;
    }

    .content a:hover {
      text-decoration: underline;
    }
  `;

  // Lifecycle method: called when element is added to DOM
  connectedCallback(): void {
    super.connectedCallback();
    this._configureMarked();
  }

  // Reactive update lifecycle: called when properties change
  protected willUpdate(changedProperties: Map<string, any>): void {
    super.willUpdate(changedProperties);
    
    // Only reprocess content if content or enableMarkdown changed
    if (changedProperties.has('content') || changedProperties.has('enableMarkdown')) {
      this._processContent();
    }
  }

  // Configure marked with security settings
  private _configureMarked(): void {
    // Configure marked for security and consistency
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert line breaks to <br>
    });
  }

  // Process markdown content with sanitization
  private _processContent(): void {
    if (!this.content) {
      this._processedContent = '';
      return;
    }
    try {
    // Convert markdown to HTML
    const rawHtml = marked.parse(this.content) as string;
    
    // Sanitize HTML to prevent XSS attacks
    this._processedContent = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a', 'hr'
        ],
        ALLOWED_ATTR: ['href', 'title', 'target'],
        ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp):)?\/\// // Only allow http/https/ftp links
    });
    } catch (error) {
    // Fallback to plain text if markdown parsing fails
    console.warn('Markdown parsing failed:', error);
    this._processedContent = this._escapeHtml(this.content);
    }
  }

  // Utility method to escape HTML
  private _escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Render method
  protected render(): unknown {
    const roleDisplayName = this.role.charAt(0).toUpperCase() + this.role.slice(1);
    
    return html`
      <div class="message ${this.role}">
        <div class="role">${roleDisplayName}</div>
        <div class="content">
          ${unsafeHTML(this._processedContent)}
        </div>
      </div>
    `;
  }
}