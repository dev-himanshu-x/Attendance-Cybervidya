import { Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { downloadHallTicket, readDownloadError } from "../../api/exam";
import { useToast } from "../../hooks/useToast";
import {
	useExamSessionsQuery,
	useHallTicketsQuery,
} from "../../queries/useAdmitCardQuery";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Select from "../ui/Select";
import Skeleton from "../ui/Skeleton";

interface AdmitCardProps {
	token: string | null;
	studentId: number | null;
}

function saveBlob(blob: Blob, fileName: string) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export default function AdmitCard({ token, studentId }: AdmitCardProps) {
	const toast = useToast();
	const sessionsQuery = useExamSessionsQuery(token, studentId);
	const [sessionId, setSessionId] = useState<number | null>(null);
	const [downloadingId, setDownloadingId] = useState<number | null>(null);
	const ticketsQuery = useHallTicketsQuery(token, sessionId);

	const sessions = sessionsQuery.data ?? [];
	const tickets = ticketsQuery.data ?? [];

	useEffect(() => {
		if (sessionId === null && sessions.length > 0) {
			setSessionId(sessions[sessions.length - 1].sessionId);
		}
	}, [sessions, sessionId]);

	const handleDownload = async (id: number) => {
		if (!token) return;
		setDownloadingId(id);
		try {
			const { blob, fileName } = await downloadHallTicket(token, id);
			saveBlob(blob, fileName);
		} catch (err) {
			toast.error(await readDownloadError(err));
		} finally {
			setDownloadingId(null);
		}
	};

	if (sessionsQuery.isError) return null;

	return (
		<Card>
			<div className="flex items-center gap-2 mb-4">
				<FileText size={18} />
				<h3 className="text-brutal mb-0">Admit Card / Hall Ticket</h3>
			</div>

			{sessionsQuery.isLoading ? (
				<Skeleton style={{ height: "3rem" }} />
			) : sessions.length === 0 ? (
				<p className="text-sm mb-0 text-[var(--clay-muted)]">
					No exam sessions found for you yet.
				</p>
			) : (
				<>
					<Select
						className="mb-4"
						value={sessionId === null ? "" : String(sessionId)}
						options={sessions.map((s) => ({
							value: String(s.sessionId),
							label: s.sessionName,
						}))}
						onValueChange={(v) => setSessionId(Number(v))}
						aria-label="Exam session"
					/>

					{ticketsQuery.isLoading ? (
						<Skeleton style={{ height: "2.5rem" }} />
					) : ticketsQuery.isError ? (
						<p className="text-sm mb-0 text-[var(--clay-danger)]">
							Could not load admit cards. Please try again later.
						</p>
					) : tickets.length === 0 ? (
						<p className="text-sm mb-0 text-[var(--clay-muted)]">
							No admit card has been published for this session.
						</p>
					) : (
						<div className="flex flex-wrap gap-2">
							{tickets.map((ticket) => (
								<Button
									key={ticket.id}
									variant="primary"
									icon={<Download size={14} />}
									disabled={downloadingId !== null}
									onClick={() => handleDownload(ticket.id)}
								>
									{downloadingId === ticket.id ? "Downloading…" : ticket.title}
								</Button>
							))}
						</div>
					)}
				</>
			)}
		</Card>
	);
}
