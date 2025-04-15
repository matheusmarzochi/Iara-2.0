"use client"

import { CheckCircle, Globe, Menu, Moon, Sun, X, Linkedin, Facebook, Twitter, MapPin, Mail, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { texts } from "~/lib/texts"
import { Logo } from "~/components/logo";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Button } from "~/components/ui/button"

export default function IaraLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState<"en" | "br">("br")
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const t = texts[language]

  const toggleLanguage = () => {
    setLanguage(language === "br" ? "en" : "br")
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
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
            <Link href="#about" className="text-sm font-medium hover:text-primary">
              {t.nav.about}
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              {t.nav.howItWorks}
            </Link>
            <Link href="#benefits" className="text-sm font-medium hover:text-primary">
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
                href="#about"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.about}
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.howItWorks}
              </Link>
              <Link
                href="#benefits"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.benefits}
              </Link>
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    {t.hero.title}
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    {t.hero.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <SignedOut>
                    <SignInButton>
                      <Button variant="outline" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        {t.hero.signIn}
                      </Button>
                    </SignInButton>
                    <SignUpButton>
                      <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                        {t.hero.signUp}
                      </Button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard">
                      <Button variant="outline" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        {t.hero.dashboard}
                      </Button>
                    </Link>
                  </SignedIn>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[500px] aspect-square">
                  <Image
                    src="/images/drives.png"
                    alt="Iara F4P Research Visualization"
                    width={500}
                    height={500}
                    className="rounded-lg object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-24  bg-accent">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t.about.title}</h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.about.description}
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{t.about.f4pMethodTitle}</h3>
                  <p className="text-muted-foreground">
                    {t.about.f4pMethodDesc1}
                  </p>
                  <p className="text-muted-foreground">
                    {t.about.f4pMethodDesc2}
                  </p>
                </div>
              </div>
              <Image
                src="/images/about.png"
                alt={t.about.altText}
                width={400}
                height={400}
                className="mx-auto object-cover object-center"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t.howItWorks.title}</h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.howItWorks.description}
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-center">{t.howItWorks.step1Title}</h3>
                <p className="text-sm text-center text-muted-foreground">
                  {t.howItWorks.step1Desc}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-center">{t.howItWorks.step2Title}</h3>
                <p className="text-sm text-center text-muted-foreground">
                  {t.howItWorks.step2Desc}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-center">{t.howItWorks.step3Title}</h3>
                <p className="text-sm text-center text-muted-foreground">
                  {t.howItWorks.step3Desc}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="text-xl font-bold text-center">{t.howItWorks.step4Title}</h3>
                <p className="text-sm text-center text-muted-foreground">
                  {t.howItWorks.step4Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t.benefits.title}</h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.benefits.description}
              </p>
            </div>
            <div className="mx-auto max-w-3xl py-12">
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{t.benefits.benefit1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{t.benefits.benefit2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{t.benefits.benefit3}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{t.benefits.benefit4}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{t.benefits.benefit5}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonials Section 
        <section id="testimonials" className="py-16 md:py-24 bg-accent">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t.testimonials.title}</h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.testimonials.description}
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5 text-primary"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm leading-loose text-muted-foreground">
                    "{t.testimonials.testimonial1.text}"
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="rounded-full bg-muted h-10 w-10"></div>
                  <div>
                    <p className="text-sm font-medium">{t.testimonials.testimonial1.name}</p>
                    <p className="text-xs text-muted-foreground">{t.testimonials.testimonial1.role}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5 text-primary"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm leading-loose text-muted-foreground">
                    "{t.testimonials.testimonial2.text}"
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="rounded-full bg-muted h-10 w-10"></div>
                  <div>
                    <p className="text-sm font-medium">{t.testimonials.testimonial2.name}</p>
                    <p className="text-xs text-muted-foreground">{t.testimonials.testimonial2.role}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5 text-primary"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm leading-loose text-muted-foreground">
                    "{t.testimonials.testimonial3.text}"
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="rounded-full bg-muted h-10 w-10"></div>
                  <div>
                    <p className="text-sm font-medium">{t.testimonials.testimonial3.name}</p>
                    <p className="text-xs text-muted-foreground">{t.testimonials.testimonial3.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        Testimonials Section */}

        {/* CTA Section 
        <section id="contact" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {t.cta.title}
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.cta.description}
              </p>
            </div>
            <div className="mx-auto max-w-lg space-y-6 py-12">
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t.cta.nameLabel}
                  </label>
                  <input
                    id="name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={t.cta.namePlaceholder}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t.cta.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={t.cta.emailPlaceholder}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="company"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t.cta.companyLabel}
                  </label>
                  <input
                    id="company"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={t.cta.companyPlaceholder}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t.cta.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={t.cta.messagePlaceholder}
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  {t.cta.submitButton}
                </button>
              </form>
            </div>
          </div>
        </section>
        CTA Section */}
      </main>

      {/* Footer */}
      <footer className="border-t bg-accent">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/favicon/favicon.svg"
                  alt="Favicon"
                  width={24}
                  height={24}
                  className="w-8 h-8"
                />
                <Logo className="w-10" />
              </div>
              <p className="text-sm text-muted-foreground">{t.footer.tagline}</p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t.footer.company}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    {t.footer.aboutUs}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    {t.footer.careers}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    {t.footer.blog}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    {t.footer.press}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t.footer.resources}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    {t.footer.documentation}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    {t.footer.caseStudies}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    {t.footer.f4pGuide}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    {t.footer.webinars}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t.footer.contact}</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Phone className="h-5 w-8 text-muted-foreground" />
                  <span className="text-muted-foreground">{t.footer.phone}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-5 w-8 text-muted-foreground" />
                  <span className="text-muted-foreground">{t.footer.email}</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="lg:w-9 lg:h-9 md:h-7 md:w-7 sm:w-7 ml-1 text-muted-foreground" />
                  <span className="text-muted-foreground">{t.footer.address}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Iara Research. {t.footer.copyright}
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
                {t.footer.privacy}
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
                {t.footer.terms}
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
                {t.footer.cookie}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

