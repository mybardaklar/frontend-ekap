'use client'

import { useQueryState, parseAsString } from 'nuqs'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { SignInForm, SignUpForm, ForgotPasswordForm, UpdatePasswordForm } from "./auth-forms"

export function AuthDialog() {
  const [modal, setModal] = useQueryState('modal', parseAsString)

  const isOpen = !!modal

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setModal(null)
    }
  }

  const renderForm = () => {
    switch (modal) {
      case 'sign_in':
        return <SignInForm onSuccess={() => setModal(null)} />
      case 'sign_up':
        return <SignUpForm />
      case 'forgot_password':
        return <ForgotPasswordForm />
      case 'update_password': // Usually we might want to keep this as a page if it comes from email link, but let's support it here too if needed, or just redirect.
        // For update password from email, the link usually goes to /update-password page.
        // We can keep /update-password page or handle it via modal.
        // Since the user asked to replace "sign in, sign up and forgot password" pages,
        // I will focus on those. UpdatePassword usually requires a full page context or a specific token flow.
        // But for consistency let's add it.
        return <UpdatePasswordForm />
      default:
        return <SignInForm onSuccess={() => setModal(null)} />
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-6 gap-0 overflow-y-auto max-h-[90vh]">
        {/* We need DialogTitle for accessibility, but our forms have their own headers.
            We can add a visually hidden title or use the form header as the title.
            For now, let's put a hidden title to satisfy aria requirements if Shadcn requires it. */}
        <DialogTitle className="sr-only">Kimlik Doğrulama</DialogTitle>
        <DialogDescription className="sr-only">
          EKAP kimlik doğrulama formları
        </DialogDescription>

        <div className="p-4">
             {renderForm()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
