interface Props {
  children: React.ReactNode;
}

export default function DigitalCardLayout({ children }: Props) {
  return <main className="h-full overflow-hidden bg-card">{children}</main>;
}
