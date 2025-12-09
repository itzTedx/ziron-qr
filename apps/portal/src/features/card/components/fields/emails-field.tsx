import { IconMail, IconPlus, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useFieldArray,
	useFormContext,
} from "@ziron/ui/components/form";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ziron/ui/components/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ziron/ui/components/select";

import { cn } from "@ziron/utils";
import { EmailsType, LabelEnum, zCardSchema } from "@ziron/validators";

interface Props {
	data: EmailsType;
}

export const EmailsField = ({ data }: Props) => {
	const form = useFormContext<zCardSchema>();

	const { fields, append, remove } = useFieldArray({
		name: "emails",
		control: form.control,
	});

	const handleAppend = () => {
		if (data) {
			const lastEmailField = data[fields.length - 1];
			if (lastEmailField && !lastEmailField.email) {
				toast.error("Please add a email before adding another.");
				return;
			}
		}
		append({ email: "", label: "Primary" });
	};

	return (
		<div className="space-y-2">
			{fields.map((field, i) => (
				<div className="flex w-full items-end" key={field.id}>
					<FormField
						control={form.control}
						name={`emails.${i}.email`}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel className={cn(i !== 0 && "sr-only")} htmlFor={field.name}>
									Email
								</FormLabel>
								<FormControl>
									<ButtonGroup className="w-full">
										<InputGroup>
											<InputGroupInput
												className={cn("w-full rounded-e-none border-r-0")}
												id={field.name}
												placeholder="name@company.com"
												{...field}
											/>
											<InputGroupAddon>
												<IconMail className="size-4 text-muted-foreground" />
											</InputGroupAddon>
										</InputGroup>

										<Select
											defaultValue={form.getValues(`emails.${i}.label`)}
											onValueChange={(e: (typeof LabelEnum.options)[number]) =>
												form.setValue(`emails.${i}.label`, e)
											}
										>
											<SelectTrigger className="text-xs">
												<SelectValue placeholder="Label" />
											</SelectTrigger>
											<SelectContent position="item-aligned">
												{LabelEnum.options.map((option) => (
													<SelectItem key={option} value={option}>
														{option}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										{fields.length > 1 && (
											<Button
												className={cn("shrink-0 border-input-border bg-input")}
												onClick={() => remove(i)}
												size="icon"
												type="button"
												variant="outline"
											>
												<IconX className="size-4 text-muted-foreground" />
											</Button>
										)}
									</ButtonGroup>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			))}
			<Button className="gap-1 px-0" onClick={handleAppend} size="sm" type="button" variant="link">
				<IconPlus className="size-4" />
				Add work or personal email
			</Button>
		</div>
	);
};
