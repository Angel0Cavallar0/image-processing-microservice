export default function Home() {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <h1>🖼️ Microsserviço de Geração de Imagens</h1>
      <p>API serverless de processamento de imagens na Vercel.</p>

      <h2>Endpoints Disponíveis</h2>
      <ul>
        <li><code>GET /api/health</code> - Health check</li>
        <li><code>POST /api/process/resize</code> - Redimensionar imagem</li>
        <li><code>POST /api/process/add-text</code> - Adicionar texto</li>
        <li><code>POST /api/process/composite</code> - Combinar imagens</li>
        <li><code>POST /api/templates/marketing</code> - Template de marketing</li>
        <li><code>POST /api/pipeline</code> - Pipeline de operações</li>
      </ul>

      <h2>Documentação</h2>
      <p>
        Consulte o <a href="https://github.com/usuario/image-api/blob/main/README.md" target="_blank">README</a> para
        exemplos detalhados de uso de cada endpoint.
      </p>

      <h2>Quick Start</h2>
      <pre style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        overflow: 'auto'
      }}>
{`curl https://seu-projeto.vercel.app/api/health`}
      </pre>
    </div>
  );
}
