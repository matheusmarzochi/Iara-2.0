import { Linkedin, Facebook, Twitter, Phone, Mail, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Logo } from "~/components/logo";

type IaraNavbarProps = {
    language: "en" | "br"
    texts: any
}

export default function IaraNavbar({
    language,
    texts,
}: IaraNavbarProps) {
    const t = texts[language]

    return (
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
                                <Link href="/about" className="text-muted-foreground hover:text-foreground">
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
    )
}
