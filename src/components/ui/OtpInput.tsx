import clsx from "clsx";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { useEffect, useRef } from "react";

interface OtpInputProps {
	value: string;
	onChange: (value: string) => void;
	length?: number;
	id?: string;
	invalid?: boolean;
	autoFocus?: boolean;
}

export default function OtpInput({
	value,
	onChange,
	length = 6,
	id = "otp",
	invalid,
	autoFocus,
}: OtpInputProps) {
	const refs = useRef<(HTMLInputElement | null)[]>([]);
	const digits = Array.from({ length }, (_, i) => value[i] ?? "");

	useEffect(() => {
		if (autoFocus) refs.current[0]?.focus();
	}, [autoFocus]);

	function focusBox(index: number) {
		const box = refs.current[Math.max(0, Math.min(length - 1, index))];
		box?.focus();
		box?.select();
	}

	function fill(startIndex: number, raw: string) {
		const incoming = raw.replace(/\D/g, "");
		if (!incoming) return;
		const next = digits.slice();
		let cursor = startIndex;
		for (const char of incoming) {
			if (cursor >= length) break;
			next[cursor] = char;
			cursor += 1;
		}
		onChange(next.join(""));
		focusBox(cursor);
	}

	function handleChange(index: number, raw: string) {
		if (raw === "") {
			const next = digits.slice();
			next[index] = "";
			onChange(next.join(""));
			return;
		}
		fill(index, raw);
	}

	function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Backspace" && !digits[index] && index > 0) {
			e.preventDefault();
			const next = digits.slice();
			next[index - 1] = "";
			onChange(next.join(""));
			focusBox(index - 1);
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			focusBox(index - 1);
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			focusBox(index + 1);
		}
	}

	function handlePaste(index: number, e: ClipboardEvent<HTMLInputElement>) {
		e.preventDefault();
		fill(index, e.clipboardData.getData("text"));
	}

	return (
		<div className="otp-group">
			{digits.map((digit, index) => (
				<input
					// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length list of boxes
					key={index}
					ref={(node) => {
						refs.current[index] = node;
					}}
					id={index === 0 ? id : undefined}
					type="text"
					inputMode="numeric"
					autoComplete={index === 0 ? "one-time-code" : "off"}
					aria-label={`Digit ${index + 1} of ${length}`}
					value={digit}
					onChange={(e) => handleChange(index, e.target.value)}
					onKeyDown={(e) => handleKeyDown(index, e)}
					onPaste={(e) => handlePaste(index, e)}
					onFocus={(e) => e.target.select()}
					className={clsx(
						"form-control-brutal otp-box",
						invalid && "is-invalid",
					)}
				/>
			))}
		</div>
	);
}
