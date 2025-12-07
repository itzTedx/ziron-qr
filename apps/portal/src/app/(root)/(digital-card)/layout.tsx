interface Props {
  children: React.ReactNode;
}

export default function DigitalCardLayout({ children }: Props) {
  return <main className="flex h-full flex-col overflow-hidden">{children}</main>;
}
