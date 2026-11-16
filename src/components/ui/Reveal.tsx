import clsx from "clsx";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface RevealProps {
	children: ReactNode;
	className?: string;
	delay?: number;
}

export default function Reveal({
	children,
	className,
	delay = 0,
}: RevealProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node || typeof IntersectionObserver === "undefined") {
			setVisible(true);
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "0px 0px -40px 0px" },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className={clsx("reveal", visible && "reveal--visible", className)}
			style={delay ? { transitionDelay: `${delay}ms` } : undefined}
		>
			{children}
		</div>
	);
}
