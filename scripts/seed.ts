#!/usr/bin/env tsx

import { seed } from '../src/seed'

async function runSeed() {
  console.log('🌱 Running seed script...')

  try {
    await seed()
    console.log('✅ Seed completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  runSeed()
}
