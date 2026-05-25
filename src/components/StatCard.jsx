export default function StatCard({ icon: Icon, label, value, hint, color = "text-vault-purple", bg = "bg-vault-purple/10" }) {
  return (
    <div className="subtle-card p-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${bg} ${color}`}>
            <Icon size={21} />
          </div>
        )}
        <div>
          <p className="text-2xl font-bold text-vault-ink">{value}</p>
          <p className="font-semibold text-vault-ink">{label}</p>
          {hint && <p className="mt-1 text-sm text-vault-muted">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
