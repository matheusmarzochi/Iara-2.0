# IARA Extractor

Scripts para extrair, converter e estruturar reviews de usuários de aplicativos (Google Play).

## Arquivos

- **extraction.js**  
  Extrai reviews de um arquivo HTML exportado do Google Play, converte para JSON e agrupa por mês/ano.  
  Gera arquivos na pasta `rawReviews/` no formato `YYYY-MM.json`.

- **conversion.js**  
  Lê os arquivos de reviews brutos da pasta `rawReviews/`, envia cada review para a API da OpenAI para reestruturação, e salva o resultado na pasta `reviews/` com o mesmo nome do arquivo de entrada.

## Instruções de Uso

### 1. Extração dos Reviews

1. Exporte os reviews do Google Play para um arquivo HTML (ex: `review.html`).
2. Coloque o arquivo `review.html` na raiz do diretório `extractor`.
3. Execute o script de extração:

   ```bash
   node extraction.js
   ```

   Isso criará arquivos `.json` agrupados por mês em `rawReviews/`.

### 2. Conversão e Estruturação dos Reviews

1. Certifique-se de ter uma chave de API da OpenAI e defina a variável de ambiente:

   ```bash
   export OPENAI_API_KEY=sk-...
   ```

2. Execute o script de conversão:

   ```bash
   node conversion.js
   ```

   O script irá processar todos os arquivos em `rawReviews/` e salvar os resultados estruturados em `reviews/`.

## Observações

- Os scripts requerem Node.js.
- O `conversion.js` utiliza a API da OpenAI e pode consumir créditos.
- Os arquivos de saída em `reviews/` terão o mesmo nome dos arquivos de entrada, mas com o conteúdo já estruturado para análise.

