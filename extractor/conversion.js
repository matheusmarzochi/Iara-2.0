import fs from 'fs/promises';
import path from 'path';

function buildPrompt(reviewJson) {
    const promptTemplate = `
Você é um assistente de análise de feedback de clientes. Sua tarefa é processar o JSON de review de um aplicativo fornecido abaixo. Seu objetivo principal é reorganizar o texto original do review do usuário para preencher os campos de um novo JSON estruturado, modificando minimamente as palavras do usuário. Apenas separe as partes relevantes do review entre 'propósito' e 'explicação da nota'.

Review para Análise (substitua o conteúdo abaixo pelo seu JSON de review):

JSON

${JSON.stringify(reviewJson, null, 2)}
Sua Tarefa:

Com base no JSON de review fornecido acima, gere um único objeto JSON como saída. Ao preencher os campos textuais, priorize o uso das frases e palavras exatas do usuário encontradas no campo "review".

Estrutura do JSON de Saída Esperado:

JSON
{
  "email": "user-1@example.com",
  "answers": [{
    "purpose": "Partes do review do usuário que descrevem seu objetivo, se foi alcançado e os motivos diretos, usando suas palavras.",
    "score": 0,
    "explanation": "Partes do review do usuário que explicam diretamente a nota (stars) atribuída, usando suas palavras."
  }]
}
Instruções Detalhadas para Popular o JSON de Saída:

email (String):

Crie um endereço de e-mail.
Use o campo "name" do review de entrada: normalize o nome (ex: minúsculas, sem espaços ou substituindo espaços por um ponto ou hífen).
Adicione um código único derivado do campo "date" do review de entrada (ex: parte numérica da data como YYYYMMDD ou os segundos/milissegundos do timestamp).
O domínio deve ser @example.com.
Exemplo: Se name é "Gabriel Vieira" e date é "2020-09-01T00:00:00.000Z", o email poderia ser gabriel.vieira.20200901000000@example.com. Siga o formato [nome_normalizado].[codigo_timestamp]@example.com.
answers (Array de Objetos):

Este array conterá um único objeto para o review analisado.

Dentro do objeto no array answers:

purpose (String):

Construa esta string extraindo e concatenando as partes relevantes do texto original do campo "review" que respondem à pergunta: "Pensando no seu principal objetivo ao usar nosso aplicativo, o quão bem ele te ajudou a alcançar esse propósito e por quê?"
Inferência do Propósito (Implícita): Identifique qual era o provável objetivo do usuário com base no que ele tentou fazer ou nas funcionalidades que criticou/elogiou.
Texto do Usuário sobre o Atendimento ao Propósito e Razões: Use as palavras do usuário para descrever se o objetivo foi ou não atendido e quais foram os motivos diretos.
Exemplo de como o texto do usuário seria usado: Se o review diz "Queria pagar minhas contas, mas o scanner de código de barras não funciona e as Ted têm taxação absurda.", o campo purpose poderia conter algo como: "Principal objetivo: Pagar contas e fazer transferências. App não ajudou pois: 'o scanner de código de barras não funciona' e 'as Ted feitas pelo app tem uma taxação absurda'." (Note o uso direto das citações do usuário).
Mantenha a linguagem original do usuário o máximo possível.
score (Number):

Popule este campo com o valor numérico do campo "stars" do JSON de review de entrada.
explanation (String):

Construa esta string extraindo e concatenando as partes relevantes do texto original do campo "review" que respondem à pergunta: "Conte-nos porque você deu sua nota."
Utilize as palavras do usuário que justificam a avaliação geral e a nota atribuída.
Exemplo de como o texto do usuário seria usado: Se o review diz "App terrível... Enfim.. fica muito atrás de outros app de banco..", o campo explanation poderia conter: "Nota 1: Usuário descreve como 'App terrível'. Principais queixas do review que justificam a nota: [liste aqui as queixas usando as palavras do usuário, como 'scanner de código de barras não funciona', etc.]. Conclusão do usuário: 'Enfim.. fica muito atrás de outros app de banco..'."
Mantenha a linguagem original do usuário o máximo possível.
Instruções Adicionais:

A saída final DEVE SER APENAS o objeto JSON, sem nenhum texto ou explicação adicional fora dele.
O foco é separar e alocar o texto original do usuário nas seções corretas (purpose e explanation), com o mínimo de alteração no texto do usuário.
Se o review for positivo, a mesma lógica se aplica: use as palavras positivas do usuário para preencher os campos.
`;
    return promptTemplate.trim();
}

/**
 * Valida se o objeto está no formato esperado da resposta da OpenAI.
 * @param {object} obj O objeto a ser validado.
 * @returns {boolean} true se válido, false caso contrário.
 */
function isValidOpenAIResponse(obj) {
    if (
        typeof obj !== 'object' ||
        obj === null ||
        typeof obj.email !== 'string' ||
        !Array.isArray(obj.answers) ||
        obj.answers.length !== 1
    ) {
        return false;
    }
    const answer = obj.answers[0];
    if (
        typeof answer !== 'object' ||
        typeof answer.purpose !== 'string' ||
        typeof answer.score !== 'number' ||
        typeof answer.explanation !== 'string'
    ) {
        return false;
    }
    return true;
}

/**
 * Envia o review para a API da OpenAI e retorna o objeto JSON de resposta.
 * @param {object} review O objeto JSON do review a ser analisado.
 * @returns {Promise<object>} O objeto JSON retornado pela OpenAI.
 */
async function sendPromptToOpenAI(review) {
    const prompt = buildPrompt(review);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY não definida');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4.1-nano',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1024,
            temperature: 0.2
        })
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Erro da OpenAI: ${err}`);
    }
    const data = await response.json();
    // Tenta converter a resposta da OpenAI para objeto JSON
    try {
        const parsed = JSON.parse(data.choices[0].message.content.trim());
        if (!isValidOpenAIResponse(parsed)) {
            throw new Error('Formato da resposta da OpenAI inválido: ' + JSON.stringify(parsed));
        }
        return parsed;
    } catch (e) {
        throw new Error('Resposta da OpenAI não é um JSON válido: ' + data.choices[0].message.content.trim());
    }
}



/**
 * Processa um arquivo de reviews brutos, envia cada review para a OpenAI,
 * e salva as respostas em um arquivo na pasta 'reviews' com o mesmo nome.
 * @param {string} filename Nome do arquivo (ex: '2018-09.json')
 */
async function convertRawReviewsFile(filename) {
    const rawPath = `./rawReviews/${filename}`;
    const outPath = `./reviews/${filename}`;

    // Verifica se o arquivo de saída já existe
    try {
        await fs.access(outPath);
        console.log(`Arquivo ${outPath} já existe. Ignorando processamento.`);
        return;
    } catch (e) {
        // Arquivo não existe, pode continuar
    }

    const rawData = await fs.readFile(rawPath, 'utf-8');
    const reviews = JSON.parse(rawData);

    const results = [];
    const total = reviews.length;
    let processed = 0;
    for (const review of reviews) {
        try {
            const result = await sendPromptToOpenAI(review);
            results.push(result);
            processed++;
            console.log(`[${filename}] Prompt executado com sucesso (${processed}/${total}) - Faltam ${total - processed}`);
        } catch (err) {
            results.push({ error: err.message, review });
            processed++;
            console.log(`[${filename}] Erro ao processar review (${processed}/${total}) - Faltam ${total - processed}`);
        }
    }

    // Salva as respostas no arquivo de saída
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, JSON.stringify(results, null, 2), 'utf-8');
}

const runner = async () => {
  await convertRawReviewsFile("2018-09.json")
  await convertRawReviewsFile("2018-10.json")
  await convertRawReviewsFile("2018-11.json")
  await convertRawReviewsFile("2018-12.json")
  await convertRawReviewsFile("2019-01.json")
  await convertRawReviewsFile("2019-02.json")
  await convertRawReviewsFile("2019-04.json")
  await convertRawReviewsFile("2019-05.json")
  await convertRawReviewsFile("2019-06.json")
  await convertRawReviewsFile("2019-07.json")
  await convertRawReviewsFile("2019-08.json")
  await convertRawReviewsFile("2019-09.json")
  await convertRawReviewsFile("2019-10.json")
  await convertRawReviewsFile("2019-11.json")
  await convertRawReviewsFile("2019-12.json")
  await convertRawReviewsFile("2020-01.json")
  await convertRawReviewsFile("2020-02.json")
  await convertRawReviewsFile("2020-04.json")
  await convertRawReviewsFile("2020-05.json")
  await convertRawReviewsFile("2020-06.json")
  await convertRawReviewsFile("2020-07.json")
  await convertRawReviewsFile("2020-08.json")
  await convertRawReviewsFile("2020-09.json")
  await convertRawReviewsFile("2020-10.json")
  await convertRawReviewsFile("2020-11.json")
  await convertRawReviewsFile("2020-12.json")
  await convertRawReviewsFile("2021-01.json")
  await convertRawReviewsFile("2021-02.json")
  await convertRawReviewsFile("2021-04.json")
  await convertRawReviewsFile("2021-05.json")
  await convertRawReviewsFile("2021-06.json")
  await convertRawReviewsFile("2021-07.json")
  await convertRawReviewsFile("2021-08.json")
  await convertRawReviewsFile("2021-09.json")
  await convertRawReviewsFile("2021-10.json")
  await convertRawReviewsFile("2021-11.json")
  await convertRawReviewsFile("2021-12.json")
  await convertRawReviewsFile("2022-01.json")
  await convertRawReviewsFile("2022-02.json")
  await convertRawReviewsFile("2022-04.json")
  await convertRawReviewsFile("2022-05.json")
  await convertRawReviewsFile("2022-06.json")
  await convertRawReviewsFile("2022-07.json")
  await convertRawReviewsFile("2022-08.json")
  await convertRawReviewsFile("2022-09.json")
  await convertRawReviewsFile("2022-10.json")
  await convertRawReviewsFile("2022-11.json")
  await convertRawReviewsFile("2022-12.json")
  await convertRawReviewsFile("2023-01.json")
  await convertRawReviewsFile("2023-02.json")
  await convertRawReviewsFile("2023-04.json")
  await convertRawReviewsFile("2023-05.json")
  await convertRawReviewsFile("2023-06.json")
  await convertRawReviewsFile("2023-07.json")
  await convertRawReviewsFile("2023-08.json")
  await convertRawReviewsFile("2023-09.json")
  await convertRawReviewsFile("2023-10.json")
  await convertRawReviewsFile("2023-11.json")
  await convertRawReviewsFile("2023-12.json")
  await convertRawReviewsFile("2024-01.json")
  await convertRawReviewsFile("2024-02.json")
  await convertRawReviewsFile("2024-04.json")
  await convertRawReviewsFile("2024-05.json")
  await convertRawReviewsFile("2024-06.json")
  await convertRawReviewsFile("2024-07.json")
  await convertRawReviewsFile("2024-08.json")
  await convertRawReviewsFile("2024-09.json")
  await convertRawReviewsFile("2024-10.json")
  await convertRawReviewsFile("2024-11.json")
  await convertRawReviewsFile("2024-12.json")
  await convertRawReviewsFile("2025-01.json")
  await convertRawReviewsFile("2025-02.json")
  await convertRawReviewsFile("2025-04.json")
  await convertRawReviewsFile("2025-05.json")
}


runner()