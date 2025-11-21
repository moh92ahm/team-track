import type { Metadata } from 'next'
import { UserSignupForm } from '@/components/user/forms/user-signup-form'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Employee registration',
}

export default async function PublicSignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Employee Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Fill out the form below to create your employee account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <UserSignupForm />
        </div>
      </div>
    </div>
  )
}
