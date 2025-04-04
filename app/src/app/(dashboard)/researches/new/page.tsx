import { CreateResearchForm } from "./components/create-research-form";

export default function CreateResearchPage() {
	return (
		<>
			<header className="pt-4 pb-6 space-y-2">
				<div className="flex items-center justify-between">
					<h2 className="text-3xl font-semibold leading-tight">Pesquisa</h2>
					{/* <Button size="sm" variant="outline">
            Preview
          </Button> */}
				</div>
			</header>

			<CreateResearchForm />
		</>
	);
}
