export function Footer() {
    return (
        <footer className="h2 border-t bg-background flex items-center justify-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mini App. All rights reserved.
        </footer>
    )
}