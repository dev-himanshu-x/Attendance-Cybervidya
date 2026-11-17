import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

export interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps {
	value: string;
	options: SelectOption[];
	onValueChange: (value: string) => void;
	"aria-label": string;
	placeholder?: string;
	className?: string;
}

export default function Select({
	value,
	options,
	onValueChange,
	"aria-label": ariaLabel,
	placeholder,
	className,
}: SelectProps) {
	return (
		<SelectPrimitive.Root value={value} onValueChange={onValueChange}>
			<SelectPrimitive.Trigger
				aria-label={ariaLabel}
				className={clsx("form-control-brutal select-trigger", className)}
			>
				<SelectPrimitive.Value placeholder={placeholder} />
				<SelectPrimitive.Icon className="select-trigger__icon">
					<ChevronDown size={16} />
				</SelectPrimitive.Icon>
			</SelectPrimitive.Trigger>
			<SelectPrimitive.Portal>
				<SelectPrimitive.Content
					position="popper"
					sideOffset={6}
					className="select-content"
				>
					<SelectPrimitive.Viewport>
						{options.map((option) => (
							<SelectPrimitive.Item
								key={option.value}
								value={option.value}
								className="select-item"
							>
								<SelectPrimitive.ItemText>
									{option.label}
								</SelectPrimitive.ItemText>
								<SelectPrimitive.ItemIndicator className="select-item__check">
									<Check size={14} />
								</SelectPrimitive.ItemIndicator>
							</SelectPrimitive.Item>
						))}
					</SelectPrimitive.Viewport>
				</SelectPrimitive.Content>
			</SelectPrimitive.Portal>
		</SelectPrimitive.Root>
	);
}
