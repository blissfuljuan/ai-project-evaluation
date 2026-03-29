import { Avatar, AvatarFallback } from "../ui/avatar";

export function TopBanner() {
    return (
        <header className="h-14 bg-background border-b flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold">Mini App</h1>

            <Avatar>
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
        </header>
    )
}