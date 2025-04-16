import { NextResponse } from 'next/server'

// POST /api/evisa - Thêm thông tin visa mới
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const nationality = formData.get('nationality')?.toString().replace(/"/g, '') // Remove quotes
    const fullName = formData.get('fullName')?.toString().replace(/"/g, '')
    const passportNumber = formData.get('passportNumber')?.toString().replace(/"/g, '')
    const dateOfBirth = formData.get('dateOfBirth')?.toString().replace(/"/g, '')
    const visaImage = formData.get('visaImage') as File | null

    console.log('Processing request with data:', { 
      nationality, 
      fullName, 
      passportNumber, 
      dateOfBirth,
      hasImage: !!visaImage,
      imageType: visaImage?.type,
      imageSize: visaImage?.size
    })

    if (!nationality || !fullName || !passportNumber || !dateOfBirth || !visaImage) {
      return NextResponse.json({ 
        error: 'All fields are required',
        details: {
          nationality: !nationality,
          fullName: !fullName,
          passportNumber: !passportNumber,
          dateOfBirth: !dateOfBirth,
          visaImage: !visaImage
        }
      }, { status: 400 })
    }

    try {
      // Create a new FormData object to send to worker
      const workerFormData = new FormData()
      workerFormData.append('nationality', nationality)
      workerFormData.append('fullName', fullName)
      workerFormData.append('passportNumber', passportNumber)
      workerFormData.append('dateOfBirth', dateOfBirth)
      
      // Handle the image file
      const imageBlob = new Blob([await visaImage.arrayBuffer()], { type: visaImage.type })
      workerFormData.append('visaImage', imageBlob, visaImage.name)

      console.log('Sending request to worker...')

      // Send request to worker
      const workerResponse = await fetch('https://visa-webapp.transytrong20.workers.dev/api/evisa', {
        method: 'POST',
        body: workerFormData
      })

      console.log('Worker response status:', workerResponse.status)
      const data = await workerResponse.json()
      console.log('Worker response:', data)

      if (!workerResponse.ok) {
        const errorMessage = typeof data === 'object' && data && 'error' in data
          ? String(data.error)
          : 'Failed to process request'
        throw new Error(errorMessage)
      }

      return NextResponse.json(data)
    } catch (error) {
      console.error('Error saving data:', error)
      return NextResponse.json({ 
        error: 'Failed to save data', 
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ 
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

// GET /api/evisa - Kiểm tra thông tin visa
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const nationality = searchParams.get('nationality')?.replace(/"/g, '')
    const fullName = searchParams.get('fullName')?.replace(/"/g, '')
    const passportNumber = searchParams.get('passportNumber')?.replace(/"/g, '')
    const dateOfBirth = searchParams.get('dateOfBirth')?.replace(/"/g, '')

    if (!nationality || !fullName || !passportNumber || !dateOfBirth) {
      return NextResponse.json({ 
        error: 'All fields are required',
        details: {
          nationality: !nationality,
          fullName: !fullName,
          passportNumber: !passportNumber,
          dateOfBirth: !dateOfBirth
        }
      }, { status: 400 })
    }

    // Forward request to worker
    const workerUrl = `https://visa-webapp.transytrong20.workers.dev/api/evisa?nationality=${encodeURIComponent(nationality)}&fullName=${encodeURIComponent(fullName)}&passportNumber=${encodeURIComponent(passportNumber)}&dateOfBirth=${encodeURIComponent(dateOfBirth)}`
    
    const response = await fetch(workerUrl)
    const data = await response.json()

    if (!response.ok) {
      const errorMessage = typeof data === 'object' && data && 'error' in data
        ? String(data.error)
        : 'Failed to check visa'
      throw new Error(errorMessage)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error checking visa:', error)
    return NextResponse.json({ 
      error: 'Failed to check visa',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 