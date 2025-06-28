export default function StickyTitle({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="sticky text-lg font-bold top-0 w-full text-neutral-600 dark:text-neutral-200 bg-white dark:bg-black p-6 text-center border-y-1 dark:border-neutral-800 border-neutral-200">
      {children}
    </section>
  );
}
