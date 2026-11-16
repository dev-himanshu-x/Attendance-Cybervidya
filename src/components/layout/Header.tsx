import clsx from "clsx";
import { LogOut, Search } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	onLogout: () => void;
}

export default function Header({
	searchQuery,
	onSearchChange,
	onLogout,
}: HeaderProps) {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setIsScrolled(window.scrollY > 10);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header
			className={clsx("site-header", isScrolled && "site-header--scrolled")}
		>
			<div className="page site-header__inner">
				<div className="site-logo shrink-0">
					Cyber<span className="site-logo__accent">Vidya</span>
				</div>

				<div className="flex items-center gap-1 min-w-0">
					<div className="form-field w-36 sm:w-72 lg:w-96">
						<span className="form-field__icon">
							<Search size={15} />
						</span>
						<input
							type="search"
							placeholder="Search"
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							aria-label="Search courses"
							className="form-control-brutal form-control-brutal--with-icon-start"
							style={{
								height: "2.25rem",
								padding: "0 0.75rem 0 2.25rem",
								fontSize: "0.8125rem",
							}}
						/>
					</div>
					<ThemeToggle />
					<button
						type="button"
						onClick={onLogout}
						className="icon-btn"
						aria-label="Log out"
						title="Log out"
					>
						<LogOut size={16} />
					</button>
				</div>
			</div>
		</header>
	);
}
