import { useFormState } from "react-hook-form";
import { Button, type ButtonProps } from "./ui/button";
import { LoaderIcon } from "lucide-react";

export function StatusButton({
	children,
	isPending,
	...props
}: ButtonProps & { isPending?: boolean }) {
	const { isSubmitting, isValid, errors } = useFormState();

	const isPendingStatus = isSubmitting || isPending;

	return (
		<Button disabled={isPendingStatus || !isValid || props.disabled} {...props}>
			{isPendingStatus ? (
				<>
					<span className="sr-only">Salvando Informações...</span>
					<LoaderIcon className="size-4 animate-spin" />
				</>
			) : (
				children
			)}
		</Button>
	);
}
