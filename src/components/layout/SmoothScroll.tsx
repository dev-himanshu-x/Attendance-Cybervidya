import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

const prefersReducedMotion =
	typeof window !== "undefined" &&
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function SmoothScroll({ children }: { children: ReactNode }) {
	if (prefersReducedMotion) return <>{children}</>;

	return (
		<ReactLenis root options={{ lerp: 0.12, smoothWheel: true }}>
			{children}
		</ReactLenis>
	);
}
