import Cookies from "js-cookie";
import { CalendarDays, LayoutGrid, SearchX, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useAttendanceQuery } from "../../queries/useAttendanceQuery";
import { useScheduleQuery } from "../../queries/useScheduleQuery";
import { useStudentIdQuery } from "../../queries/useStudentIdQuery";
import { COOKIE_EXPIRY, STUDENT_ID_COOKIE_NAME } from "../../types/constants";
import type {
	AttendanceComponentInfo,
	CourseAttendanceInfo,
} from "../../types/response";
import Header, { type AppPage } from "../layout/Header";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Reveal from "../ui/Reveal";
import CalendarView from "./CalendarView";
import CourseCard from "./CourseCard";
import Daywise from "./Daywise";
import ExamsPage from "./ExamsPage";
import OverallAtt from "./OverallAtt";
import Profile from "./Profile";
import Projections from "./Projections";
import TodayClasses from "./TodayClasses";

export interface SelectedComponentType {
	course: CourseAttendanceInfo;
	component: AttendanceComponentInfo;
}

interface AttendanceProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	onLogout: () => void;
}

function Attendance({
	searchQuery,
	onSearchChange,
	onLogout,
}: AttendanceProps) {
	const { token } = useAuthToken();
	const attendanceQuery = useAttendanceQuery(token);
	const attendanceData = attendanceQuery.data ?? null;
	const scheduleQuery = useScheduleQuery(token);

	const [studentId, setStudentId] = useState<number | null>(() => {
		const cookieStudentId = Cookies.get(STUDENT_ID_COOKIE_NAME);
		return cookieStudentId ? Number(cookieStudentId) : null;
	});

	const studentIdQuery = useStudentIdQuery(token, studentId === null);

	useEffect(() => {
		if (attendanceData === null) {
			setStudentId(null);
		}
	}, [attendanceData]);

	useEffect(() => {
		if (studentIdQuery.data) {
			setStudentId(studentIdQuery.data);
			Cookies.set(STUDENT_ID_COOKIE_NAME, String(studentIdQuery.data), {
				expires: COOKIE_EXPIRY,
			});
		}
	}, [studentIdQuery.data]);

	const [selectedComponent, setSelectedComponent] =
		useState<SelectedComponentType | null>(null);
	const [isDaywiseModalOpen, setIsDaywiseModalOpen] = useState(false);
	const [isProjectionVisible, setIsProjectionVisible] = useState(false);
	const [page, setPage] = useState<AppPage>("attendance");
	const [viewMode, setViewMode] = useState<"card" | "calendar">("card");
	const projectionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isProjectionVisible) {
			requestAnimationFrame(() => {
				projectionRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			});
		}
	}, [isProjectionVisible]);

	const handleViewDaywiseAttendance = useCallback(
		(
			course: SelectedComponentType["course"],
			component: SelectedComponentType["component"],
		) => {
			setSelectedComponent({ course, component });
			setIsDaywiseModalOpen(true);
		},
		[],
	);

	useEffect(() => {
		// Scroll to the top after login
		window.scrollTo({ top: 0, behavior: "instant" });
	}, []);

	const handlePageChange = useCallback((next: AppPage) => {
		setPage(next);
		window.scrollTo({ top: 0, behavior: "instant" });
	}, []);

	const trimmedSearchQuery = searchQuery.trim();
	const isSearching = trimmedSearchQuery.length > 0;

	const filteredCourses = useMemo(() => {
		const list = attendanceData?.attendanceCourseComponentInfoList ?? [];
		const query = trimmedSearchQuery.toLowerCase();
		if (!query) return list;
		return list.filter(
			(course) =>
				course.courseName.toLowerCase().includes(query) ||
				course.courseCode.toLowerCase().includes(query),
		);
	}, [attendanceData, trimmedSearchQuery]);

	if (!attendanceData) return null;

	return (
		<div className="grow flex flex-col">
			<Header
				page={page}
				onPageChange={handlePageChange}
				searchQuery={searchQuery}
				onSearchChange={onSearchChange}
				onLogout={onLogout}
			/>
			<div className="page">
				{page === "exams" ? (
					<ExamsPage token={token} studentId={studentId} />
				) : isSearching ? (
					<div id="search-results">
						<h2 className="section__title">
							Results for "{trimmedSearchQuery}"
						</h2>
						{filteredCourses.length === 0 ? (
							<div className="flex flex-col items-center text-center text-[var(--clay-muted)] py-12">
								<SearchX size={36} className="mb-4" />
								<p className="font-semibold text-brutal mb-1">
									No courses match "{trimmedSearchQuery}"
								</p>
								<p className="text-sm mb-0">
									Try a different course name or code.
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
								{filteredCourses.map((course) => (
									<CourseCard
										key={course.courseCode}
										onViewDaywiseAttendance={handleViewDaywiseAttendance}
										course={course}
									/>
								))}
							</div>
						)}
					</div>
				) : (
					<>
						<div id="overview" className="pt-6 pb-10">
							<Profile attendanceData={attendanceData} />
						</div>

						<Reveal>
							<div id="attendance" className="section">
								<OverallAtt attendanceData={attendanceData} />
							</div>
						</Reveal>

						<Reveal>
							<div className="py-4">
								<TodayClasses
									token={token}
									studentId={studentId}
									attendanceData={attendanceData}
									schedule={scheduleQuery.data ?? []}
									isLoading={scheduleQuery.isLoading}
									isProjectionVisible={isProjectionVisible}
									onToggleProjection={() =>
										setIsProjectionVisible((prev) => !prev)
									}
								/>
							</div>
						</Reveal>

						{isProjectionVisible && (
							<div ref={projectionRef} className="py-4">
								<Projections
									token={token}
									schedule={scheduleQuery.data ?? []}
									onClose={() => setIsProjectionVisible(false)}
								/>
							</div>
						)}

						<div id="courses" className="section pb-0">
							<div className="flex items-center justify-between gap-2 mb-5">
								<h2 className="section__title mb-0">Courses</h2>
								<div className="flex items-center gap-1">
									<Button
										variant="outline"
										active={viewMode === "card"}
										icon={<LayoutGrid size={14} />}
										hideTextOnMobile
										onClick={() => setViewMode("card")}
									>
										Cards
									</Button>
									<Button
										variant="outline"
										active={viewMode === "calendar"}
										icon={<CalendarDays size={14} />}
										hideTextOnMobile
										onClick={() => setViewMode("calendar")}
									>
										Calendar
									</Button>
								</div>
							</div>

							{viewMode === "card" ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
									{filteredCourses.map((course) => (
										<CourseCard
											key={course.courseCode}
											onViewDaywiseAttendance={handleViewDaywiseAttendance}
											course={course}
										/>
									))}
								</div>
							) : (
								<CalendarView
									token={token ?? ""}
									studentId={studentId || 0}
									attendanceData={attendanceData}
								/>
							)}
						</div>
					</>
				)}

				{/* Modal to show daywise attendance */}
				{isDaywiseModalOpen && selectedComponent && (
					<Modal variant="soft" onClose={() => setIsDaywiseModalOpen(false)}>
						<div className="flex justify-between items-center gap-2 mb-4">
							<h2 className="text-xl mb-0 min-w-0">
								Daywise Attendance for{" "}
								<span className="font-bold">
									{selectedComponent.course.courseName} -{" "}
									{selectedComponent.component.componentName}
								</span>
							</h2>
							<button
								type="button"
								className="btn-brutal btn-brutal--plain text-[var(--clay-danger)] text-2xl shrink-0"
								onClick={() => setIsDaywiseModalOpen(false)}
							>
								<X />
							</button>
						</div>

						<Daywise
							token={token ?? ""}
							payload={{
								courseCompId: selectedComponent.component.courseComponentId,
								courseId: selectedComponent.course.courseId,
								sessionId: null,
								studentId: studentId || 0,
							}}
						/>
					</Modal>
				)}
			</div>
		</div>
	);
}

export default Attendance;
