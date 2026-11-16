import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import {
	DEFAULT_TARGET_PERCENTAGE,
	MAX_TARGET_PERCENTAGE,
	MIN_TARGET_PERCENTAGE,
} from "../types/constants";

interface TargetPercentageContextValue {
	targetPercentage: number;
	setTargetPercentage: (value: number) => void;
}

const TARGET_STORAGE_KEY = "targetPercentage";

function clampTarget(value: number): number {
	return Math.min(
		MAX_TARGET_PERCENTAGE,
		Math.max(MIN_TARGET_PERCENTAGE, value),
	);
}

function getInitialTarget(): number {
	try {
		const stored = localStorage.getItem(TARGET_STORAGE_KEY);
		if (stored === null) return DEFAULT_TARGET_PERCENTAGE;
		const parsed = Number(stored);
		return Number.isFinite(parsed)
			? clampTarget(Math.round(parsed))
			: DEFAULT_TARGET_PERCENTAGE;
	} catch {
		return DEFAULT_TARGET_PERCENTAGE;
	}
}

const TargetPercentageContext = createContext<
	TargetPercentageContextValue | undefined
>(undefined);

export function TargetPercentageProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [targetPercentage, setTargetPercentageState] =
		useState<number>(getInitialTarget);

	const setTargetPercentage = useCallback((value: number) => {
		const clamped = clampTarget(value);
		setTargetPercentageState(clamped);
		try {
			localStorage.setItem(TARGET_STORAGE_KEY, String(clamped));
		} catch {
			// Storage unavailable (e.g. private browsing) — the value still applies for this visit.
		}
	}, []);

	const value = useMemo(
		() => ({ targetPercentage, setTargetPercentage }),
		[targetPercentage, setTargetPercentage],
	);

	return (
		<TargetPercentageContext.Provider value={value}>
			{children}
		</TargetPercentageContext.Provider>
	);
}

export function useTargetPercentage(): TargetPercentageContextValue {
	const ctx = useContext(TargetPercentageContext);
	if (!ctx) {
		throw new Error(
			"useTargetPercentage must be used within a TargetPercentageProvider",
		);
	}
	return ctx;
}
