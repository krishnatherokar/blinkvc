export default function PeopleCard({
  username,
  children,
}: Readonly<{
  username: String;
  children: React.ReactNode;
}>) {
  const bgColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
  ];
  const randomBgColor = bgColors[Math.floor(Math.random() * bgColors.length)];

  return (
    <div className="my-4 mx-auto p-4 max-w-80">
      <div
        className={`h-8 w-8 inline-flex justify-center pt-0.5 mr-2 text-white rounded-full ${randomBgColor}`}
      >
        {username.slice(0, 2)}
      </div>
      <span className="text-neutral-300 dark:text-neutral-700">@</span>
      {username}
      {children}
    </div>
  );
}

export function NoPeople({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-2/3 flex flex-col justify-center text-center text-neutral-300 dark:text-neutral-700 p-4">
      {children}
    </div>
  );
}
