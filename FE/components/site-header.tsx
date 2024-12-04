export function SiteHeader() {
  return (
    <header className="px-4  sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <div className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
              Crypto Planet
            </div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-6">
            <a
              href="/market"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Market
            </a>
            <a
              href="/portfolio"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Portfolio
            </a>
            <a
              href="/watchlist"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Watchlist
            </a>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Register
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
