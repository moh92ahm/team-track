import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const data = await req.json()

    // Find a basic employee role
    const employeeRole = await payload.find({
      collection: 'roles',
      where: {
        level: { equals: 'employee' },
      },
      limit: 1,
    })

    if (employeeRole.docs.length === 0) {
      return NextResponse.json(
        { error: 'No employee role found. Please contact administrator.' },
        { status: 500 },
      )
    }

    // Create the user with basic employee role
    const newUser = await payload.create({
      collection: 'users',
      data: {
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        password: data.password,
        primaryPhone: data.primaryPhone,
        birthDate: data.birthDate,
        joinedAt: data.joinedAt,
        nationality: data.nationality || undefined,
        identificationNumber: data.identificationNumber || undefined,
        address: data.address || undefined,
        role: employeeRole.docs[0].id,
        employmentType: 'other', // Default employment type
        isActive: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        userId: newUser.id,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Signup error:', error)

    // Handle specific errors
    if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
      return NextResponse.json({ error: 'Email or username already exists' }, { status: 400 })
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 },
    )
  }
}
