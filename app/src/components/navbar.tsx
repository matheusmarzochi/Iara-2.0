"use client"

import { Globe, Menu, Moon, Sun, X, Linkedin, Facebook, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Logo } from "~/components/logo";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Button } from "~/components/ui/button"

type IaraNavbarProps = {
    language: "en" | "br"
    setLanguage: (lang: "en" | "br") => void
    mounted: boolean
    theme: string | undefined
    setTheme: (theme: string) => void
    texts: any
}

export default function IaraNavbar({
    language,
    setLanguage,
    mounted,
    theme,
    setTheme,
    texts,
}: IaraNavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const t = texts[language]

    const toggleLanguage = () => {
        setLanguage(language === "br" ? "en" : "br")
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-navbg backdrop-blur supports-[backdrop-filter]:bg-navbg/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/favicon/favicon.svg"
                            alt="Favicon"
                            width={24}
                            height={24}
                            className="w-8 h-8"
                        />
                        <Logo className="w-10" />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/#about" className="text-sm font-medium hover:text-primary">
                        {t.nav.about}
                    </Link>
                    <Link href="/#how-it-works" className="text-sm font-medium hover:text-primary">
                        {t.nav.howItWorks}
                    </Link>
                    <Link href="/#benefits" className="text-sm font-medium hover:text-primary">
                        {t.nav.benefits}
                    </Link>
                    {/* 
                        <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
                        {t.nav.testimonials}
                        </Link>
                        <Link href="#contact" className="text-sm font-medium hover:text-primary">
                        {t.nav.contact}
                        </Link>
                        */}
                    <SignedOut>
                        <SignInButton>
                            <Button variant="outline" size="sm">{t.hero.signIn}</Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button size="sm">{t.hero.signUp}</Button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <Link href="/dashboard">
                            <Button variant="outline" size="sm">{t.hero.dashboard}</Button>
                        </Link>
                    </SignedIn>
                    <Button
                        onClick={toggleTheme}
                        variant={"link"}
                        className="flex items-center text-gray-900 dark:text-gray-200 gap-1 px-2 py-1 rounded-md hover:bg-accent"
                        aria-label="Toggle theme"
                    >
                        {mounted && (
                            theme === 'dark' ?
                                <Sun className="h-4 w-4" /> :
                                <Moon className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        onClick={toggleLanguage}
                        variant={"link"}
                        className="flex items-center text-gray-900 dark:text-gray-200 gap-1 ml-2 px-2 py-1 rounded-md hover:bg-accent"
                    >
                        <Globe className="h-4 w-4" />
                        <span className="text-xs font-medium">{language.toUpperCase()}</span>
                    </Button>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                    <Button
                        onClick={toggleTheme}
                        variant={"link"}
                        className="flex items-center text-gray-900 dark:text-gray-200 gap-1 px-2 py-1 rounded-md hover:bg-accent"
                        aria-label="Toggle theme"
                    >
                        {mounted && (
                            theme === 'dark' ?
                                <Sun className="h-4 w-4" /> :
                                <Moon className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        onClick={toggleLanguage}
                        variant={"link"}
                        className="flex items-center text-gray-900 dark:text-gray-200 gap-1 px-2 py-1 rounded-md hover:bg-accent"
                    >
                        <Globe className="h-4 w-4" />
                        <span className="text-xs font-medium">{language.toUpperCase()}</span>
                    </Button>
                    <Button
                        variant={"link"}
                        className="flex items-center text-gray-900 dark:text-gray-200 justify-center rounded-md p-2 hover:bg-accent/50"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden container py-4 border-t">
                    <nav className="flex flex-col space-y-4">
                        <Link
                            href="/#about"
                            className="text-sm font-medium hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t.nav.about}
                        </Link>
                        <Link
                            href="/#how-it-works"
                            className="text-sm font-medium hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t.nav.howItWorks}
                        </Link>
                        <Link
                            href="/#benefits"
                            className="text-sm font-medium hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t.nav.benefits}
                        </Link>
                        {/*
                        <Link
                            href="#testimonials"
                            className="text-sm font-medium hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t.nav.testimonials}
                        </Link>
                        <Link
                            href="#contact"
                            className="text-sm font-medium hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t.nav.contact}
                        </Link>
                        */}
                        <div className="flex flex-col space-y-2 pt-4 border-t">
                            <SignedOut>
                                <SignInButton>
                                    <Button variant="outline" onClick={() => setIsMenuOpen(false)}>{t.hero.signIn}</Button>
                                </SignInButton>
                                <SignUpButton>
                                    <Button onClick={() => setIsMenuOpen(false)}>{t.hero.signUp}</Button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <Link href="/dashboard">
                                    <Button variant="outline" onClick={() => setIsMenuOpen(false)} className="w-full">{t.hero.dashboard}</Button>
                                </Link>
                            </SignedIn>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}
