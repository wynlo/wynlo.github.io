export function CategoryTag({ category }: { category: string }) {
  return <span className="inline-flex h-5 items-center whitespace-nowrap rounded bg-surface-strong px-1.5 text-xs text-muted">{category}</span>
}
