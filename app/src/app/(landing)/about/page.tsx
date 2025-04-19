"use client"

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes"
import { texts } from "~/lib/texts"
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";

const team = [
    {
        name: "Matheus Marzochi",
        role: {
            br: "CEO / Head de Produto",
            en: "CEO / Head of Product"
        },
        initials: "MM",
        description: {
            br: "Líder visionário apaixonado por construir produtos impactantes.",
            en: "Visionary leader passionate about building impactful products."
        },
        photo: "/team/matheus.png",
        socials: {
            linkedin: "https://www.linkedin.com/in/matheusmarzochi/",
        },
    },
    {
        name: "Ivan Micai",
        role: {
            br: "CTO / Head de Tecnologia",
            en: "CTO / Head of Technology"
        },
        initials: "IM",
        description: {
            br: "Entusiasta de tecnologia impulsionando inovação e soluções escaláveis.",
            en: "Tech enthusiast driving innovation and scalable solutions."
        },
        photo: "/team/ivan.png",
        socials: {
            linkedin: "https://www.linkedin.com/in/ivanmicai/",
        },
    },
    {
        name: "Victor Akimoto",
        role: {
            br: "Designer Líder UI/UX",
            en: "Lead Designer UI/UX"
        },
        initials: "VA",
        description: {
            br: "Desenha experiências encantadoras com foco no usuário.",
            en: "Designs delightful experiences with a user-first mindset."
        },
        photo: "/team/victor.png",
        socials: {
            linkedin: "https://www.linkedin.com/in/victorakimoto/",
        },
    },
    {
        name: "Tatiane Rodrigues",
        role: {
            br: "Redatora Líder / Estrategista de Conteúdo",
            en: "Lead Writer / Content Strategist"
        },
        initials: "TR",
        description: {
            br: "Cria narrativas envolventes e comunicação clara.",
            en: "Crafts compelling narratives and clear communication."
        },
        photo: "/team/tatiane.png",
        socials: {
            linkedin: "https://www.linkedin.com/in/tatianergn/",
        },
    },
];

export default function CarrearPage() {
    const [language, setLanguage] = useState<"en" | "br">("br")
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    // Adiciona textos internacionalizados para o título e descrição
    const teamTexts = {
        br: {
            title: "Conheça nosso time",
            description: "Profissionais apaixonados construindo o futuro da Iara."
        },
        en: {
            title: "Meet Our Team",
            description: "Passionate professionals building the future of Iara."
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar
                language={language}
                setLanguage={setLanguage}
                mounted={mounted}
                theme={theme}
                setTheme={setTheme}
                texts={texts}
            />

            {/* Decorative background pattern */}
            <div className="relative max-w-3xl mx-auto text-center mb-8 z-10 py-10 px-4 sm:py-16 sm:mb-12">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-sky-900 dark:text-sky-200 mb-3 sm:mb-4 drop-shadow-lg">
                    {teamTexts[language].title}
                </h1>
                <p className="text-base sm:text-lg text-gray-700 font-medium dark:text-gray-300">
                    {teamTexts[language].description}
                </p>
            </div>
            <div className="relative max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 z-10 mb-10 sm:mb-20 px-4">
                {team.map((member) => (
                    <div
                        key={member.name}
                        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center text-center border border-sky-50 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group dark:bg-slate-800 dark:border-slate-700"
                    >
                        <div className="relative mb-3 sm:mb-4">
                            <img
                                src={member.photo}
                                alt={member.name}
                                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover shadow-lg border-4 border-white group-hover:ring-4 group-hover:ring-sky-200 transition dark:border-slate-700 dark:group-hover:ring-sky-900"
                            />
                        </div>
                        <div>
                            <div className="text-lg sm:text-2xl font-bold text-sky-900 dark:text-sky-200">
                                <a
                                    href={member.socials.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline hover:text-indigo-700 dark:hover:text-indigo-300 transition"
                                >
                                    {member.name}
                                </a>
                            </div>
                            <div className="text-sky-600 font-medium mb-1 dark:text-sky-400 text-sm sm:text-base">
                                {member.role[language]}
                            </div>
                            <div className="text-gray-500 text-xs sm:text-sm mb-2 dark:text-gray-300">
                                {member.description[language]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Footer
                language={language}
                texts={texts}
            />
        </div>
    );
}
