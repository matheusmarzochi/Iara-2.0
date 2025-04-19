"use client"

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes"
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";
import Image from "next/image";
import { texts } from "~/lib/texts"

const webinars = [
    {
        url: "https://www.youtube.com/live/At8RKghmC-0",
        youtubeId: "At8RKghmC-0",
        lang: "pt-BR",
        title: {
            "br": "Sessão \"Live Marketing\" - Design de Produto, Fit for Purpose e IA",
            "en": "Live Marketing Session - Product Design, Fit for Purpose and AI"
        },
        description: {
            "br": "Sessão estilo Live Coding com Rodrigo Yoshima, aplicando o framework Fit for Purpose e inteligência artificial para melhorar o design de um produto com mais de 40% de overserving. Descubra como tornar o produto mais aderente ao propósito do cliente e aprenda sobre marketing estratégico ao vivo e direto ao ponto.",
            "en": "A Live Coding-style session with Rodrigo Yoshima, applying the Fit for Purpose framework and AI to improve the design of a product with over 40% overserving. Learn how to better align the product with customer purpose and explore strategic marketing in a live and straightforward format."
        }
    },
    {
        url: "https://www.youtube.com/watch?v=o-nrlMcMYfE",
        youtubeId: "o-nrlMcMYfE",
        lang: "pt-BR",
        title: {
            "br": "Fit-for-Purpose e como liderar organizações rumo ao produto certo - LKBR18",
            "en": "Fit-for-Purpose and Leading Organizations to the Right Product - LKBR18"
        },
        description: {
            "br": "Palestra no Lean Kanban Brazil 2018 com Andressa Chiara e Marco Dubovski. Explorando como o Fit-for-Purpose, aliado ao Kanban, transforma organizações ao alinhar propósito com necessidades reais dos clientes. Inclui estudos de caso e histórias inspiradoras de engajamento e criatividade.",
            "en": "Talk from Lean Kanban Brazil 2018 with Andressa Chiara and Marco Dubovski. This session explores how Fit-for-Purpose, combined with Kanban, transforms organizations by aligning purpose with real customer needs. Includes case studies and inspiring stories of engagement and creativity."
        }
    },
    {
        url: "https://www.youtube.com/watch?v=NDNMyMPGcUA",
        youtubeId: "NDNMyMPGcUA",
        lang: "en-US",
        title: {
            "br": "#43 FIT FOR PURPOSE - DAVID ANDERSON | Being Human",
            "en": "#43 FIT FOR PURPOSE - DAVID ANDERSON | Being Human"
        },
        description: {
            "br": "David Anderson, pioneiro no uso do Kanban em empresas, compartilha ideias sobre propósito do cliente, pensamento evolucionário no desenvolvimento de produtos, mudanças organizacionais (com esquilos cinzas e vermelhos!) e como Bruce Lee o inspira em sua liderança.",
            "en": "David Anderson, a pioneer in using Kanban across enterprises, shares insights on customer purpose, evolutionary thinking in product development, organizational change (with grey vs. red squirrels!), and how Bruce Lee inspires his leadership style."
        }
    }
];

const i18n = {
    headerTitle: {
        "br": "Webinars sobre F4P e Produto Digital",
        "en": "Webinars on F4P and Digital Product"
    },
    headerDesc: {
        "br": "Assista aos melhores webinars para aprofundar seu conhecimento em Fit for Purpose, métricas e segmentação de usuários.",
        "en": "Watch the best webinars to deepen your knowledge in Fit for Purpose, metrics, and user segmentation."
    },
    watchOnYoutube: {
        "br": "Assistir no YouTube →",
        "en": "Watch on YouTube →"
    },
    langTag: {
        "pt-BR": { "br": "Português", "en": "Portuguese" },
        "en-US": { "br": "Inglês", "en": "English" }
    }
};

export default function WebnarsPage() {
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
                            {i18n.headerTitle[language]}
                        </h1>
                        <p className="text-sky-700 dark:text-sky-300 font-medium">
                            {i18n.headerDesc[language]}
                        </p>
                    </header>
                    <section className="space-y-8">
                        {webinars.map((webinar) => (
                            <a
                                key={webinar.youtubeId}
                                href={webinar.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col md:flex-row items-start gap-6 bg-white/80 dark:bg-slate-900/80 border border-sky-100 dark:border-slate-800 rounded-xl shadow hover:shadow-lg transition-shadow p-5"
                            >
                                <div className="flex-shrink-0">
                                    <Image
                                        src={`https://img.youtube.com/vi/${webinar.youtubeId}/hqdefault.jpg`}
                                        alt={`Thumbnail de ${webinar.title[language]}`}
                                        width={240}
                                        height={135}
                                        className="rounded-lg border border-sky-100 dark:border-slate-800"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-semibold text-sky-800 dark:text-sky-200">{webinar.title[language]}</h2>
                                        <span className="ml-2 px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900 text-xs font-semibold text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-slate-800">
                                            {i18n.langTag[webinar.lang as "pt-BR" | "en-US"]?.[language] || webinar.lang}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-200 text-base">{webinar.description[language]}</p>
                                    <span className="inline-block mt-3 text-sky-600 dark:text-sky-400 text-sm font-medium">{i18n.watchOnYoutube[language]}</span>
                                </div>
                            </a>
                        ))}
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