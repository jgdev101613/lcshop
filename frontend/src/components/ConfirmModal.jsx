const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-base-100 p-6 shadow-xl border border-base-300">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>

        <p className="text-sm opacity-70 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn btn-ghost btn-sm">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="btn btn-error btn-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
