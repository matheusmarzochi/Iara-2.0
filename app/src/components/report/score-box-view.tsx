import { cn } from "~/lib/utils"
import type { ScoreBox } from "iara-shared/database/schema"

export default function ScoreBoxView({ fit, neutral, unfit, className }: ScoreBox & { className?: string }) {
    return (
        <div className={cn("bg-[#F8FAFC] dark:bg-sky-900 rounded-lg p-3 md:p-4 flex flex-col justify-center border border-gray-300 dark:border-sky-800", className)}>
            <div className="flex items-center justify-center h-full w-full">
                <div className="flex flex-1 flex-col items-center justify-center text-center h-full">
                    <span className="text-green-600 dark:text-green-400 font-bold text-lg">{fit}%</span>
                    <span className="text-xs text-muted-foreground dark:text-white">Fit</span>
                </div>
                <div className="h-12 w-px bg-gray-300 dark:bg-sky-800 mx-2"/>
                <div className="flex flex-1 flex-col items-center justify-center text-center h-full">
                    <span className="text-amber-500 dark:text-amber-400 font-bold text-lg">{neutral}%</span>
                    <span className="text-xs text-muted-foreground dark:text-white">Neutral</span>
                </div>
                <div className="h-12 w-px bg-gray-300 dark:bg-sky-800 mx-2"/>
                <div className="flex flex-1 flex-col items-center justify-center text-center h-full">
                    <span className="text-red-500 dark:text-red-400 font-bold text-lg">{unfit}%</span>
                    <span className="text-xs text-muted-foreground dark:text-white">Unfit</span>
                </div>
            </div>
        </div>
    )
}
