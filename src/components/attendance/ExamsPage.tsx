import AdmitCard from "./AdmitCard";

interface ExamsPageProps {
	token: string | null;
	studentId: number | null;
}

export default function ExamsPage({ token, studentId }: ExamsPageProps) {
	return (
		<div id="exams" className="pt-6 pb-10">
			<div className="flex flex-col gap-5">
				<AdmitCard token={token} studentId={studentId} />
			</div>
		</div>
	);
}
