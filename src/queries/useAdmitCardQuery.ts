import { useQuery } from "@tanstack/react-query";
import { fetchExamSessions, fetchHallTickets } from "../api/exam";

export function useExamSessionsQuery(
	token: string | null,
	studentId: number | null,
) {
	return useQuery({
		queryKey: ["examSessions", token, studentId],
		queryFn: () => fetchExamSessions(token as string, studentId as number),
		enabled: !!token && !!studentId,
	});
}

export function useHallTicketsQuery(
	token: string | null,
	sessionId: number | null,
) {
	return useQuery({
		queryKey: ["hallTickets", token, sessionId],
		queryFn: () => fetchHallTickets(token as string, sessionId as number),
		enabled: !!token && sessionId !== null,
	});
}
