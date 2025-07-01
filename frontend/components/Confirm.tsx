type ConfirmDialog = {
  text: string;
  confirmText: string;
  isRisky?: boolean;
};

const Confirm = ({
  dialog,
  handle,
}: {
  dialog: ConfirmDialog | null;
  handle: (result: boolean) => void;
}) => {
  return (
    <>
      {dialog && (
        <div className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div
            className="w-full max-w-md bg-gray-200 p-6 m-2 rounded-xl
            dark:bg-gray-800"
          >
            <p className="pb-4 mx-1">{dialog.text}</p>
            <div className="flex w-full">
              <button
                className={`${
                  dialog.isRisky
                    ? "bg-red-500/10 text-red-600"
                    : "bg-blue-500/10 text-blue-600"
                } flex-1 px-4 py-2 mx-1 rounded-md`}
                onClick={() => handle(true)}
              >
                {dialog.confirmText}
              </button>
              <button
                className="flex-1 px-4 py-2 mx-1 rounded-md text-neutral-600 bg-neutral-500/20
                dark:text-neutral-400"
                onClick={() => handle(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Confirm;
