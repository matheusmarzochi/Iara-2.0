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
        const savedLang = typeof window !== "undefined" ? localStorage.getItem("iara-lang") : null;
        if (savedLang === "en" || savedLang === "br") {
            setLanguage(savedLang);
        }
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("iara-lang", language);
        }
    }, [language, mounted])

    const t = texts[language].f4pGuide;

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
                            {t.title} <span className="text-sky-500 dark:text-sky-400">{t.titleHighlight}</span>
                        </h1>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                            <p className="text-sky-700 dark:text-sky-300 font-medium">
                                <strong>{t.readingTimeLabel}</strong> {t.readingTime} &nbsp;|&nbsp; <strong>{t.levelLabel}</strong> {t.level}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                <span>{t.publishedAt}</span> &nbsp;|&nbsp; <span>{t.author}</span>
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {t.tags.map(tag => (
                                <span key={tag} className="bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 px-2 py-1 rounded-full text-xs font-semibold">{tag}</span>
                            ))}
                        </div>
                    </header>

                    <section className="mb-10">
                        <p className="text-lg text-gray-700 dark:text-gray-200">
                            {t.intro}
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-sky-800 dark:text-sky-200 mb-3">{t.whatIsTitle}</h2>
                        <p className="dark:text-gray-200">
                            {t.whatIsDesc}
                        </p>
                        <ol className="list-decimal ml-6 my-4 space-y-1 dark:text-gray-200">
                            {t.dimensions.map((item, i) => (
                                <li key={i}><strong>{item.title}</strong> - {item.desc}</li>
                            ))}
                        </ol>
                        <p className="dark:text-gray-200">
                            {t.whatIsBottom}
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-sky-800 dark:text-sky-200 mb-3">{t.whyTitle}</h2>
                        <div className="overflow-x-auto rounded-xl border border-sky-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 shadow mb-4">
                            <table className="min-w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-sky-50 dark:bg-slate-800">
                                        <th className="py-2 px-4 font-semibold text-sky-900 dark:text-sky-200">{t.tableHeaders[0]}</th>
                                        <th className="py-2 px-4 font-semibold text-sky-900 dark:text-sky-200">{t.tableHeaders[1]}</th>
                                        <th className="py-2 px-4 font-semibold text-sky-900 dark:text-sky-200">{t.tableHeaders[2]}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {t.tableRows.map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? "dark:bg-slate-900/40" : "bg-sky-50/40 dark:bg-slate-800/40"}>
                                            <td className="py-2 px-4"><strong>{row.benefit}</strong></td>
                                            <td className="py-2 px-4">{row.impact}</td>
                                            <td className="py-2 px-4">{row.how}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-sky-800 dark:text-sky-200 mb-3">{t.stepsTitle}</h2>
                        <h3 className="text-lg font-semibold text-sky-700 dark:text-sky-300 mt-6 mb-2">{t.step1Title}</h3>
                        <p className="dark:text-gray-200">
                            {t.step1Desc}
                        </p>
                        <ol className="list-decimal ml-6 my-3 space-y-1 dark:text-gray-200">
                            {t.step1Questions.map((q, i) => (
                                <li key={i}><em>{q}</em></li>
                            ))}
                        </ol>
                        <p className="dark:text-gray-200">
                            {t.step1Bottom}
                        </p>
                        <div className="bg-sky-50 dark:bg-slate-800 border-l-4 border-sky-400 dark:border-sky-600 rounded-r px-5 py-4 my-6 text-sm shadow dark:text-gray-200">
                            <b>{t.cardExampleTitle}</b><br />
                            {t.cardExample}
                        </div>

                        <h3 className="text-lg font-semibold text-sky-700 dark:text-sky-300 mt-8 mb-2">{t.step2Title}</h3>
                        <p className="dark:text-gray-200">
                            {t.step2Desc}
                        </p>
                        <pre className="bg-gray-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-lg p-4 my-4 text-xs overflow-x-auto dark:text-gray-200">
                            {t.boxScoreExample}
                        </pre>

                        <h3 className="text-lg font-semibold text-sky-700 dark:text-sky-300 mt-8 mb-2">{t.step3Title}</h3>
                        <p className="dark:text-gray-200">
                            {t.step3Desc}
                        </p>
                        <ul className="list-disc ml-6 my-3 space-y-1 dark:text-gray-200">
                            {t.step3Segments.map((seg, i) => (
                                <li key={i}><strong>{seg.title}</strong> - {seg.desc}</li>
                            ))}
                        </ul>
                        <p className="dark:text-gray-200">
                            {t.step3Bottom}
                        </p>

                        <h3 className="text-lg font-semibold text-sky-700 dark:text-sky-300 mt-8 mb-2">{t.step4Title}</h3>
                        <p className="dark:text-gray-200">
                            {t.step4Desc}
                        </p>
                        <div className="my-8 flex justify-center">
                            <Image src="/images/f4p-cicle.png" alt={t.cycleAlt} width={600} height={300} className="rounded-xl border border-sky-100 dark:border-slate-800 shadow" />
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-sky-800 dark:text-sky-200 mb-3">{t.tipsTitle}</h2>
                        <ul className="list-disc ml-6 my-3 space-y-2 dark:text-gray-200">
                            {t.tips.map((tip, i) => (
                                <li key={i}><strong>{tip.strong}</strong>{tip.text}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-sky-800 dark:text-sky-200 mb-3">{t.conclusionTitle}</h2>
                        <p className="dark:text-gray-200">
                            {t.conclusionDesc}
                        </p>
                        <ol className="list-decimal ml-6 my-3 space-y-1 dark:text-gray-200">
                            {t.conclusionList.map((item, i) => (
                                <li key={i}><strong>{item.strong}</strong> {item.text}</li>
                            ))}
                        </ol>
                        <p className="dark:text-gray-200">
                            {t.conclusionBottom}
                        </p>
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

