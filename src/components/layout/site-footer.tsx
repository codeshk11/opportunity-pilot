import { Logo } from '@/components/shared/logo'

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <Logo className="text-base text-foreground" />
        <p className="text-center sm:text-right">
          Built by Team Code Crusaders, IGDTUW
          <br />
          HackIIITD 2026
        </p>
      </div>
    </footer>
  )
}
