# Fontes Roboto

Esta pasta deve conter as fontes necessárias para o processamento de texto nas imagens.

## Download das Fontes

Execute os seguintes comandos após clonar o repositório:

```bash
cd fonts

# Baixar Roboto Regular
curl -L -o Roboto-Regular.ttf "https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Regular.ttf"

# Baixar Roboto Bold
curl -L -o Roboto-Bold.ttf "https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Bold.ttf"
```

## Arquivos Necessários

- `Roboto-Regular.ttf` (291 KB) - Fonte regular
- `Roboto-Bold.ttf` (291 KB) - Fonte negrito

Essas fontes são necessárias para os endpoints:
- `/api/process/add-text`
- `/api/templates/marketing`
- `/api/pipeline` (quando incluir operação add-text)

**Nota**: Os arquivos .ttf são ignorados pelo Git (ver .gitignore) para evitar versionar binários grandes.
