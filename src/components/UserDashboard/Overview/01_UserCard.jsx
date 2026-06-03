const UserCard = ({ profile }) => {
  const displayName =
    profile?.username?.trim() || profile?.email?.split("@")[0] || "Customer";
  const secondaryText = profile?.email || "@customer";

  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl bg-white p-5 md:flex-row md:items-center md:px-6 md:py-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-500 md:h-18 md:w-18">
        {displayName.charAt(0).toUpperCase()}
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 md:text-xl">
          {displayName}
        </h2>
        <p className="mt-1 text-sm text-gray-400">{secondaryText}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-600">
            Customer
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
