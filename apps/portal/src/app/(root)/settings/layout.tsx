export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
	return (
		<>
			<main className="h-full overflow-hidden bg-card">{children}</main>
		</>
	);
}
