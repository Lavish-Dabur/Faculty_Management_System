const PrimaryButton = ({ children, onClick, color = 'bg-indigo-600', Icon, disabled = false, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`
      w-full text-white ${color} transition-all duration-200 
      font-semibold rounded-xl text-lg px-6 py-3 shadow-lg flex items-center justify-center gap-2
      ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-opacity-90 active:scale-[0.98] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-300'}
    `}
  >
    {disabled && Icon && Icon === Loader2 ? <Loader2 className="animate-spin h-5 w-5" /> : (Icon && <Icon className="h-5 w-5" />)}
    {children}
  </button>
);

export default PrimaryButton;