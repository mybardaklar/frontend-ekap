import Link from "next/link"

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 p-8 rounded-xl shadow-lg border dark:border-zinc-800 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-muted-foreground mb-6">
          There was an issue verifying your authentication code. This often happens if the link has expired or has already been used.
        </p>
        <div className="flex flex-col gap-2">
            <Link href="/?modal=sign_in" className="w-full inline-flex justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                Go to Sign In
            </Link>
            <Link href="/?modal=forgot_password" className="text-sm text-blue-500 hover:underline mt-2">
                Try resetting password again
            </Link>
        </div>
      </div>
    </div>
  )
}
