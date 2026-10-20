'use client'

import * as Tooltip from '@radix-ui/react-tooltip'

export function ComingSoonTooltip({ children }: { children: React.ReactNode }) {
  return <Tooltip.Provider delayDuration={100}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content sideOffset={8} className="z-50 rounded-md bg-ink px-2.5 py-1.5 text-xs font-medium text-paper shadow-sm">
          Coming soon
          <Tooltip.Arrow className="fill-ink" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
}
