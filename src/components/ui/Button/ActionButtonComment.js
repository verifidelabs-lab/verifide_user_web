const ActionButtonComment = ({ icon: Icon, count, isActive, isLoading, onClick, ariaLabel }) => (
    <button
        onClick={onClick}
        disabled={isLoading}
        className={`flex items-center gap-1 p-2 rounded-lg transition-colors ${isActive ? 'text-blue-600  ' : 'glassy-text-secondary hover:text-blue-600  '
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={ariaLabel}
    >
        {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
        ) : (
            <Icon size={18} />
        )}
        {count !== undefined && <span className="text-xs">{count}</span>}
    </button>
);
export default ActionButtonComment