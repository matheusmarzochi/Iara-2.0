"use client";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ArrowLeftIcon, UploadIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { uploadResearchFile } from "./action";
import { useRouter } from "next/navigation";

export default function UploadResearchPage() {
	const router = useRouter();
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0] || null;
		setFile(selectedFile);
		setError(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!file) {
			setError("Por favor, selecione um arquivo para enviar.");
			return;
		}

		// Check if file is a spreadsheet
		const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
		if (!validTypes.includes(file.type)) {
			setError("Por favor, envie um arquivo de planilha válido (.xlsx, .xls ou .csv).");
			return;
		}

		setUploading(true);
		
		try {
			const formData = new FormData();
			formData.append('file', file);
			
			const result = await uploadResearchFile(formData);
			
			if (result.success) {
				console.log("Arquivo enviado com sucesso:", file.name);
				router.push(`/researches/${result.researchId}`);
			} else {
				setError(result.error || "Ocorreu um erro ao enviar o arquivo. Tente novamente.");
			}
		} catch (err) {
			setError("Ocorreu um erro ao enviar o arquivo. Tente novamente.");
			console.error(err);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="flex flex-col h-[calc(100dvh-160px)]">
			<header className="pt-4 pb-6 space-y-2">
				<div className="flex items-center justify-between">
					<div className="flex flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-6">
						<Button
							size="sm"
							variant="link"
							className="p-0 text-foreground inline-flex"
							asChild
						>
							<Link href="/dashboard">
								<span className="sr-only">
									Voltar para o dashboard
								</span>
								<ArrowLeftIcon className="size-10" />
							</Link>
						</Button>

						<h2 className="text-3xl font-semibold leading-tight">Upload de Pesquisa</h2>
					</div>
				</div>
			</header>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<section className="space-y-4">
						<h3 className="text-xl font-medium">Importar Dados de Pesquisa</h3>
						<p className="text-muted-foreground">
							Envie um arquivo de planilha contendo os dados da sua pesquisa. O sistema processará os dados e criará uma nova pesquisa automaticamente.
						</p>

						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
								<div className="flex flex-col items-center justify-center gap-4">
									<UploadIcon className="size-10 text-muted-foreground" />
									
									<div className="space-y-2">
										<p className="text-sm font-medium">
											{file ? file.name : "Selecione um arquivo para upload"}
										</p>
										<p className="text-xs text-muted-foreground">
											Formatos suportados: XLSX, XLS, CSV
										</p>
									</div>
									
									<input
										type="file"
										id="file-upload"
										accept=".xlsx,.xls,.csv"
										className="hidden"
										onChange={handleFileChange}
									/>
									
									<Button
										type="button" 
										variant="outline"
										onClick={() => document.getElementById("file-upload")?.click()}
									>
										Escolher arquivo
									</Button>
								</div>
							</div>

							{error && (
								<div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
									{error}
								</div>
							)}

							<Button 
								type="submit" 
								className="w-full gap-2" 
								disabled={!file || uploading}
							>
								{uploading ? "Enviando..." : "Enviar Arquivo"}
								{!uploading && <UploadIcon className="size-4" />}
							</Button>
						</form>
					</section>
				</div>

				<div className="space-y-4">
					<h3 className="text-xl font-medium">Informações</h3>
					
					<Card className="p-4 space-y-3 border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
						<h4 className="font-medium">Formato do Arquivo</h4>
						<p className="text-sm text-muted-foreground dark:text-white">
							O arquivo deve seguir um formato específico para ser processado corretamente. Cada linha representa uma resposta de pesquisa.
						</p>
					</Card>

					<Card className="p-4 space-y-3 border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
						<h4 className="font-medium">Tamanho Máximo</h4>
						<p className="text-sm text-muted-foreground dark:text-white">
							O tamanho máximo permitido para upload é de 10MB. Arquivos maiores precisarão ser divididos.
						</p>
					</Card>

					<Card className="p-4 space-y-3 border-gray-300 bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900">
						<h4 className="font-medium">Processamento</h4>
						<p className="text-sm text-muted-foreground dark:text-white">
							Após o upload, o sistema processará os dados automaticamente. Você será notificado quando o processamento for concluído.
						</p>
					</Card>
				</div>
			</div>
		</div>
	);
}
