"use client"

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes"
import { texts } from "~/lib/texts"
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";
import Image from "next/image";

export default function F4PGuidePage() {
    const [language, setLanguage] = useState<"en" | "br">("br")
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar
                language={language}
                setLanguage={setLanguage}
                mounted={mounted}
                theme={theme}
                setTheme={setTheme}
                texts={texts}
            />
            <main className="bg-gradient-to-b from-sky-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 min-h-screen pb-16">
                <article className="max-w-3xl mx-auto px-4 py-10">
                    <header className="bg-white/80 dark:bg-slate-900/80 shadow rounded-xl px-8 py-6 mb-10 border border-sky-100 dark:border-slate-800">
                        <h1 className="text-3xl md:text-4xl font-bold text-sky-900 dark:text-sky-200 mb-2">
                            Guia Completo do Método F4P <span className="text-sky-500 dark:text-sky-400">(Fit for Purpose)</span>
                        </h1>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                            <p className="text-sky-700 dark:text-sky-300 font-medium">
                                <strong>Tempo de leitura:</strong> 8 minutos &nbsp;|&nbsp; <strong>Nível:</strong> Intermediário
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                <span>Publicado em 18/04/2025</span> &nbsp;|&nbsp; <span>Por Projeto Iara</span>
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {["UX Research", "Product Management", "Fit for Purpose", "F4P", "Métricas de Produto"].map(tag => (
                                <span key={tag} className="bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 px-2 py-1 rounded-full text-xs font-semibold">{tag}</span>
                            ))}
                        </div>
                    </header>

                    <section className="mb-10">
                        <p className="text-lg text-gray-700 dark:text-gray-200">
                            Você já se perguntou <em>por que</em> seus clientes escolhem — e permanecem usando — o seu produto? Se a resposta envolver mais palpites do que dados concretos, o <strong>método F4P (Fit for Purpose)</strong> pode ser exatamente a bússola que faltava na sua estratégia. Neste guia, mostramos <strong>o que é, por que importa e, principalmente, como aplicar o F4P</strong> no desenvolvimento de software e na pesquisa com usuários.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-sky-800 dark:text-sky-200 mb-3">O que é o Método F4P?</h2>
                        <p className="dark:text-gray-200">
                            Criado por <strong>David J. Anderson</strong> e <strong>Alexei Zheglov</strong> em 2017, o F4P parte de uma premissa simples: <em>um produto só tem sucesso quando é perfeitamente adequado ao propósito pelo qual o cliente o adotou</em>. Para avaliar essa adequação, o framework considera <strong>quatro dimensões</strong>:
                        </p>
                        <ol className="list-decimal ml-6 my-4 space-y-1 dark:text-gray-200">
                            <li><strong>Fit for Purpose</strong> - Entrega o objetivo central do cliente?</li>
                            <li><strong>Fit for Use</strong> - É usável, confiável e fácil de utilizar?</li>
                            <li><strong>Fit for the World</strong> - Continua relevante em um contexto de mercado em constante mudança?</li>
                            <li><strong>Fit for Perceived Value</strong> - Vale o preço e o esforço investidos segundo a percepção do cliente?</li>
                        </ol>
                        <p className="dark:text-gray-200">
                            Ao trazer o <em>“porquê”</em> para o centro das decisões de produto, o F4P ajuda times de UX e Produto a <strong>segmentarem usuários por motivação</strong> e <strong>medirem métricas que realmente importam</strong>.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-sky-800 dark:text-sky-200 mb-3">Por que usar o F4P em Desenvolvimento de Software e UX?</h2>
                        <div className="overflow-x-auto rounded-xl border border-sky-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 shadow mb-4">
                            <table className="min-w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-sky-50 dark:bg-slate-800">
                                        <th className="py-2 px-4 font-semibold text-sky-900 dark:text-sky-200">Benefício</th>
                                        <th className="py-2 px-4 font-semibold text-sky-900 dark:text-sky-200">Impacto</th>
                                        <th className="py-2 px-4 font-semibold text-sky-900 dark:text-sky-200">Como o F4P ajuda</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="dark:bg-slate-900/40">
                                        <td className="py-2 px-4"><strong>Redução de desperdício</strong></td>
                                        <td className="py-2 px-4">Menos features inúteis, backlog mais enxuto</td>
                                        <td className="py-2 px-4">Segmenta por propósito → prioriza o que gera valor real</td>
                                    </tr>
                                    <tr className="bg-sky-50/40 dark:bg-slate-800/40">
                                        <td className="py-2 px-4"><strong>Métricas orientadas ao cliente</strong></td>
                                        <td className="py-2 px-4">KPIs que espelham satisfação, não “vaidade”</td>
                                        <td className="py-2 px-4">Converte critérios de adequação em métricas rastreáveis</td>
                                    </tr>
                                    <tr className="dark:bg-slate-900/40">
                                        <td className="py-2 px-4"><strong>Descoberta de novos segmentos</strong></td>
                                        <td className="py-2 px-4">Abre oportunidades de novos produtos ou planos</td>
                                        <td className="py-2 px-4">Analisa padrões de propósito nos dados do F4P Card</td>
                                    </tr>
                                    <tr className="bg-sky-50/40 dark:bg-slate-800/40">
                                        <td className="py-2 px-4"><strong>Alinhamento estratégico</strong></td>
                                        <td className="py-2 px-4">Roadmap guiado por objetivos claros</td>
                                        <td className="py-2 px-4">Ciclo contínuo de feedback → ações de melhoria</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-sky-800 dark:text-sky-200 mb-3">Passo a passo para aplicar o F4P</h2>
                        <h3 className="text-lg font-semibold text-sky-700 dark:text-sky-300 mt-6 mb-2">1. Colete feedback com o <strong>F4P Card</strong></h3>
                        <p className="dark:text-gray-200">
                            Envie um questionário curto (in-app, e-mail ou entrevista) contendo <strong>três perguntas</strong>:
                        </p>
                        <ol className="list-decimal ml-6 my-3 space-y-1 dark:text-gray-200">
                            <li><em>Quais foram até 3 motivos para você escolher nosso produto?</em></li>
                            <li><em>De 0 a 5, quanto cada motivo foi atendido?</em></li>
                            <li><em>Por que você deu essa nota?</em></li>
                        </ol>
                        <p className="dark:text-gray-200">
                            Limitar a <strong>três razões</strong> força o cliente a focar no que realmente importa.
                        </p>
                        <div className="bg-sky-50 dark:bg-slate-800 border-l-4 border-sky-400 dark:border-sky-600 rounded-r px-5 py-4 my-6 text-sm shadow dark:text-gray-200">
                            <b>Exemplo de F4P Card (SaaS de gestão):</b><br />
                            1. Escolhi o produto porque: (a) Facilidade de uso (b) Preço acessível (c) Integração com ERP.<br />
                            2. Notas: Uso - 5 · Preço - 4 · Integração - 2<br />
                            3. Explicação: Interface muito intuitiva, preço justo, mas integração deu erros.
                        </div>

                        <h3 className="text-lg font-semibold text-sky-700 dark:text-sky-300 mt-8 mb-2">2. Construa o <strong>Fitness Box Score</strong></h3>
                        <p className="dark:text-gray-200">
                            Tabule as respostas e visualize quantos propósitos receberam notas altas (4-5), médias (3) ou baixas (0-2). Isso revela rapidamente <strong>onde o produto está (ou não) <em>fit for purpose</em></strong>.
                        </p>
                        <pre className="bg-gray-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-lg p-4 my-4 text-xs overflow-x-auto dark:text-gray-200">
                            {`Fitness Box Score - Release 24.03
┌─────────────┬────────┬───────┬───────┐
│ Propósitos  │  4-5   │   3   │  0-2  │
├─────────────┼────────┼───────┼───────┤
│ 29          │  62%   │  28%  │  10%  │
└─────────────┴────────┴───────┴───────┘`}
                        </pre>

                        <h3 className="text-lg font-semibold text-sky-700 dark:text-sky-300 mt-8 mb-2">3. Identifique <strong>segmentos por propósito</strong></h3>
                        <p className="dark:text-gray-200">
                            Agrupe respostas semelhantes. Você pode descobrir, por exemplo:
                        </p>
                        <ul className="list-disc ml-6 my-3 space-y-1 dark:text-gray-200">
                            <li><strong>Segmento Casual</strong> - busca rapidez e preço baixo, insatisfeito com velocidade.</li>
                            <li><strong>Segmento Pro</strong> - precisa de integrações robustas e suporte, satisfeito nos dois quesitos.</li>
                        </ul>
                        <p className="dark:text-gray-200">
                            Decida <strong>quais segmentos priorizar</strong> ou ajustar na próxima iteração.
                        </p>

                        <h3 className="text-lg font-semibold text-sky-700 dark:text-sky-300 mt-8 mb-2">4. Defina métricas e feche o ciclo de melhoria</h3>
                        <p className="dark:text-gray-200">
                            Transforme os critérios em <strong>KPIs rastreáveis</strong> (por exemplo, <em>tempo de resposta da API &lt; 300 ms</em>, <em>SLA de 99,9%</em>). Acompanhe-os release a release e <strong>refaça o F4P Card</strong> periodicamente.
                        </p>
                        <div className="my-8 flex justify-center">
                            <Image src="/images/ciclo-f4p.svg" alt="Ciclo F4P" width={600} height={300} className="rounded-xl border border-sky-100 dark:border-slate-800 shadow" />
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-sky-800 dark:text-sky-200 mb-3">Melhores práticas e dicas rápidas</h2>
                        <ul className="list-disc ml-6 my-3 space-y-2 dark:text-gray-200">
                            <li><strong>Integre ao seu fluxo ágil</strong>: adicione o envio do F4P Card como parte da “Definition of Done” de features críticas.</li>
                            <li><strong>Combine métodos</strong>: use testes de usabilidade para encontrar problemas de interação e o F4P para saber se a solução cobre o objetivo macro.</li>
                            <li><strong>Evite métricas de vaidade</strong>: se não reflete valor ao usuário, não deveria ser KPI.</li>
                            <li><strong>Documente aprendizados</strong>: converta segmentos em personas orientadas a objetivos, inspiradas em <em>Goal-Directed Design</em> de Alan Cooper.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-sky-800 dark:text-sky-200 mb-3">Conclusão</h2>
                        <p className="dark:text-gray-200">
                            O F4P não substitui os métodos clássicos de UX Research — ele <strong>completa o arsenal</strong> ao responder a pergunta que mais interessa: <em>“Estamos entregando o que o cliente realmente quer?”</em>. Ao coletar <strong>propósitos, notas e justificativas</strong> num processo leve e recorrente, você:
                        </p>
                        <ol className="list-decimal ml-6 my-3 space-y-1 dark:text-gray-200">
                            <li><strong>Alinha produto, UX e negócio</strong> na mesma métrica de sucesso.</li>
                            <li><strong>Prioriza features</strong> que movem agulhas de satisfação.</li>
                            <li><strong>Aumenta retenção</strong> ao servir segmentos mais valiosos.</li>
                        </ol>
                        <p className="dark:text-gray-200">
                            Pronto para testar o F4P? Comece criando seu primeiro F4P Card e descubra <strong>por que</strong> seus clientes ficam — ou desistem — do seu produto.
                        </p>
                        <blockquote className="border-l-4 border-sky-400 dark:border-sky-600 bg-sky-50/60 dark:bg-slate-800/60 rounded-r px-5 py-4 my-6 text-sky-900 dark:text-sky-200">
                            <strong>⚡ Dica final</strong>: adote o mantra <em>“No propósito, sem feature”</em>. Se não há propósito claro, talvez valha reavaliar a iniciativa.
                        </blockquote>
                    </section>
                </article>
            </main>
            <Footer
                language={language}
                texts={texts}
            />
        </div>
    );
}

