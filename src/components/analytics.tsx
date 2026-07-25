'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useRef } from 'react'

const goatcounterCode = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE || 'wynlo'

declare global {
  interface Window {
    goatcounter?: { count?: (vars?: { path?: string }) => void }
  }
}

export function Analytics() {
  const pathname = usePathname()
  const initialLoad = useRef(true)

  useEffect(() => {
    // count.js records the initial page load itself; only client-side navigations need a manual count
    if (initialLoad.current) {
      initialLoad.current = false
      return
    }
    window.goatcounter?.count?.()
  }, [pathname])

  if (!goatcounterCode) return null

  return (
    <Script
      data-goatcounter={`https://${goatcounterCode}.goatcounter.com/count`}
      src="https://gc.zgo.at/count.js"
      strategy="afterInteractive"
    />
  )
}
