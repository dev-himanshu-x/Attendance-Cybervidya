interface FooterProps {
	onShowTerms: () => void;
}

const GITHUB_URL = "https://github.com/dev-himanshu-x";
const LINKEDIN_URL = "https://www.linkedin.com/in/dev-himanshu-jaiswal";

function Footer({ onShowTerms }: FooterProps) {
	return (
		<footer className="w-full pt-10 pb-10">
			<div className="page">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[var(--clay-divider)] pt-6 text-sm text-[var(--clay-muted)]">
					<span>© {new Date().getFullYear()} Himanshu Jaiswal</span>
					<div className="flex flex-wrap items-center gap-x-5 gap-y-2">
						<a
							href={GITHUB_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="footer-link"
						>
							GitHub
						</a>
						<a
							href={LINKEDIN_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="footer-link"
						>
							LinkedIn
						</a>
						<button type="button" onClick={onShowTerms} className="footer-link">
							Terms
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
