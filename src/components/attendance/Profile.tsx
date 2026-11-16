import type { StudentDetails } from "../../types/response";

interface ProfileProps {
	attendanceData: StudentDetails | null;
}

function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return "Good morning";
	if (hour < 17) return "Good afternoon";
	return "Good evening";
}

export default function Profile({ attendanceData }: ProfileProps) {
	if (!attendanceData) return null;

	return (
		<div className="fade-in">
			<p className="eyebrow mb-3">{getGreeting()}</p>
			<h1
				className="mb-3"
				style={{ fontSize: "clamp(2.25rem, 7vw, 3.25rem)", lineHeight: 1.05 }}
			>
				{attendanceData.fullName}
			</h1>
			<p className="text-sm text-[var(--clay-muted)] mb-0 leading-relaxed">
				{attendanceData.registrationNumber}
				<span className="mx-2">/</span>
				{attendanceData.branchShortName}, Section {attendanceData.sectionName}
				<span className="mx-2">/</span>
				{attendanceData.degreeName}, Semester {attendanceData.semesterName}
			</p>
		</div>
	);
}
