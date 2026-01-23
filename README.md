# Microsserviço de Geração de Imagens

Microsserviço serverless de processamento de imagens na Vercel usando Next.js 14, Sharp 0.32.6 e @napi-rs/canvas 0.1.58.

## 🚀 Deploy Rápido na Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Angel0Cavallar0/image-processing-microservice)

**IMPORTANTE**: Após o deploy, você precisa baixar as fontes Roboto:
```bash
curl -L -o fonts/Roboto-Regular.ttf "https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Regular.ttf"
curl -L -o fonts/Roboto-Bold.ttf "https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Bold.ttf"
```

## Características

- ✅ 6 endpoints REST para processamento de imagens
- ✅ Redimensionar, adicionar texto, combinar imagens
- ✅ Templates de marketing prontos
- ✅ Pipeline de operações em sequência
- ✅ Validação de inputs e tratamento de erros
- ✅ Otimizado para Vercel (3008MB memory, 30s timeout)
- ✅ Região gru1 (São Paulo) - baixa latência para Brasil

## Tecnologias

- **Next.js 14.2.18** - Framework React para serverless
- **Sharp 0.32.6** - Processamento de imagens de alta performance
- **@napi-rs/canvas 0.1.58** - Renderização de texto e desenhos
- **Vercel** - Deploy serverless

## Instalação Local

```bash
# Clone o repositório
git clone https://github.com/Angel0Cavallar0/image-processing-microservice.git
cd image-processing-microservice

# Baixar fontes Roboto
mkdir -p fonts
curl -L -o fonts/Roboto-Regular.ttf "https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Regular.ttf"
curl -L -o fonts/Roboto-Bold.ttf "https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Bold.ttf"

# Instalar dependências
npm install

# Rodar localmente
npm run dev
```

Acesse http://localhost:3000

## Deploy na Vercel

### Opção 1: Deploy Direto (Mais Rápido)

1. Clique no botão "Deploy with Vercel" acima
2. Conecte sua conta GitHub
3. Após deploy, baixe as fontes usando Vercel CLI ou adicione-as manualmente

### Opção 2: Via Dashboard

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe este repositório: `https://github.com/Angel0Cavallar0/image-processing-microservice`
3. As configurações de `vercel.json` serão aplicadas automaticamente
4. Clique em "Deploy"

## Endpoints Disponíveis

Acesse a URL do seu deploy + `/api/health` para verificar se está funcionando.

Exemplo: `https://seu-projeto.vercel.app/api/health`

### Documentação Completa dos Endpoints

Consulte o [ENDPOINTS.md](./ENDPOINTS.md) para documentação detalhada de todos os 6 endpoints com exemplos de uso.

**Resumo:**
- `GET /api/health` - Health check
- `POST /api/process/resize` - Redimensionar imagem
- `POST /api/process/add-text` - Adicionar texto
- `POST /api/process/composite` - Combinar imagens
- `POST /api/templates/marketing` - Gerar template de marketing
- `POST /api/pipeline` - Executar múltiplas operações

## Exemplo de Uso

```bash
# Health check
curl https://seu-projeto.vercel.app/api/health

# Gerar template de marketing
curl -X POST https://seu-projeto.vercel.app/api/templates/marketing \
  -H "Content-Type: application/json" \
  -d '{
    "title": "SUPER PROMOÇÃO",
    "subtitle": "50% OFF",
    "width": 1200,
    "height": 630
  }'
```

## Limites e Validações

- Tamanho máximo: 5MB por imagem
- Dimensões: 10px a 4096px
- Máximo 10 camadas em composite
- Máximo 20 operações em pipeline
- Formatos: JPEG, PNG, WebP

## Troubleshooting

### Fontes não encontradas
Se você vir erros sobre fontes, certifique-se de ter baixado os arquivos `.ttf` na pasta `fonts/`.

### Sharp falha no deploy
O projeto usa Sharp 0.32.6 (última versão compatível com Vercel). Se houver problemas:
```bash
npm install sharp@0.32.6 --save-exact
vercel --prod --force
```

### Timeout (504)
- Plano Hobby: 10s timeout
- Plano Pro: 60s timeout (recomendado para imagens grandes)

## Estrutura do Projeto

```
├── package.json              # Dependências
├── vercel.json               # Config Vercel (3008MB, 30s, gru1)
├── pages/
│   ├── index.js              # Página inicial
│   └── api/                  # Endpoints
│       ├── health.js
│       ├── pipeline.js
│       ├── process/
│       │   ├── resize.js
│       │   ├── add-text.js
│       │   └── composite.js
│       └── templates/
│           └── marketing.js
├── lib/                      # Utilitários
│   ├── constants.js
│   ├── validators.js
│   ├── error-handler.js
│   ├── sharp-utils.js
│   └── canvas-utils.js
└── fonts/                    # Fontes TTF
    ├── Roboto-Regular.ttf
    └── Roboto-Bold.ttf
```

## Licença

MIT

## Contribuindo

PRs são bem-vindos! Para grandes mudanças, abra uma issue primeiro.

## Links Úteis

- [Documentação da Vercel](https://vercel.com/docs)
- [Documentação do Sharp](https://sharp.pixelplumbing.com/)
- [Fontes Google](https://fonts.google.com/specimen/Roboto)

---

Desenvolvido com ❤️ usando Claude Code
