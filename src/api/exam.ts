import axios from "axios";
import type {
	ExamListResponse,
	ExamSession,
	HallTicketOption,
} from "../types/response";
import { authHeaders, getBaseUrl } from "./client";

const REQUEST_TIMEOUT_MS = 15000;

export async function fetchExamSessions(
	token: string,
	studentId: number,
): Promise<ExamSession[]> {
	const response = await axios.get<ExamListResponse<ExamSession>>(
		`${getBaseUrl()}/api/exam/form/session/config/getById/student/${studentId}`,
		{ headers: authHeaders(token), timeout: REQUEST_TIMEOUT_MS },
	);
	return response.data.data ?? [];
}

export async function fetchHallTickets(
	token: string,
	sessionId: number,
): Promise<HallTicketOption[]> {
	const response = await axios.get<ExamListResponse<HallTicketOption>>(
		`${getBaseUrl()}/api/exam/hall-ticket/student/download/options/${sessionId}`,
		{ headers: authHeaders(token), timeout: REQUEST_TIMEOUT_MS },
	);
	return response.data.data ?? [];
}

function fileNameFromDisposition(header: string | undefined, fallback: string) {
	const raw = header?.split("=")[1]?.trim().replace(/^"|"$/g, "");
	return raw || fallback;
}

export async function downloadHallTicket(
	token: string,
	hallTicketId: number,
): Promise<{ blob: Blob; fileName: string }> {
	const response = await axios.get<Blob>(
		`${getBaseUrl()}/api/report/pdf/exam/student/hall-ticket/download/${hallTicketId}`,
		{
			headers: authHeaders(token),
			responseType: "blob",
			timeout: 60000,
		},
	);
	return {
		blob: response.data,
		fileName: fileNameFromDisposition(
			response.headers["content-disposition"],
			`hall-ticket-${hallTicketId}.pdf`,
		),
	};
}

export async function readDownloadError(err: unknown): Promise<string> {
	if (axios.isAxiosError(err) && err.response?.data instanceof Blob) {
		try {
			const body = JSON.parse(await err.response.data.text());
			if (body?.error?.reason) return body.error.reason;
		} catch {
			// Not JSON; fall through to the generic message.
		}
	}
	if (axios.isAxiosError(err) && err.response?.status === 401) {
		return "Session expired. Please login again.";
	}
	return "Could not download the admit card. Please try again.";
}
