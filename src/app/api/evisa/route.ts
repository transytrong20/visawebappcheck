import { NextResponse } from 'next/server'

// Định nghĩa interface cho response data
interface WorkerResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: {
    id: number;
    nationality: string;
    full_name: string;
    passport_number: string;
    date_of_birth: string;
    image_urls: string[];
  };
}

// POST /api/evisa - Thêm thông tin visa mới
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const nationality = formData.get('nationality')?.toString().replace(/"/g, '') // Remove quotes
    const fullName = formData.get('fullName')?.toString().replace(/"/g, '')
    const passportNumber = formData.get('passportNumber')?.toString().replace(/"/g, '')
    const dateOfBirth = formData.get('dateOfBirth')?.toString().replace(/"/g, '')
    
    // Chấp nhận cả visaImage và visaImages
    let visaImages: File[] = []
    const singleImages = formData.getAll('visaImage') as File[] // Lấy tất cả visaImage
    const multipleImages = formData.getAll('visaImages') as File[] // Lấy tất cả visaImages
    
    // Kết hợp cả hai loại ảnh
    visaImages = [...singleImages, ...multipleImages]

    console.log('Received form data:', {
      nationality,
      fullName,
      passportNumber,
      dateOfBirth,
      singleImagesCount: singleImages.length,
      multipleImagesCount: multipleImages.length,
      totalImages: visaImages.length
    })

    if (!nationality || !fullName || !passportNumber || !dateOfBirth || visaImages.length === 0) {
      console.log('Validation failed:', {
        nationality: !nationality,
        fullName: !fullName,
        passportNumber: !passportNumber,
        dateOfBirth: !dateOfBirth,
        visaImages: visaImages.length === 0
      })
      return NextResponse.json({ 
        error: 'All fields are required and at least one image must be provided',
        details: {
          nationality: !nationality,
          fullName: !fullName,
          passportNumber: !passportNumber,
          dateOfBirth: !dateOfBirth,
          visaImages: visaImages.length === 0
        }
      }, { status: 400 })
    }

    try {
      console.log('Starting to process images...')
      
      // Create a single FormData with all images
      const workerFormData = new FormData()
      workerFormData.append('nationality', nationality)
      workerFormData.append('fullName', fullName)
      workerFormData.append('passportNumber', passportNumber)
      workerFormData.append('dateOfBirth', dateOfBirth)
      
      // Add all images to the same request
      for (const visaImage of visaImages) {
        console.log('Processing image:', {
          name: visaImage.name,
          type: visaImage.type,
          size: visaImage.size
        })
        
        const imageBlob = new Blob([await visaImage.arrayBuffer()], { type: visaImage.type })
        workerFormData.append('visaImages', imageBlob, visaImage.name)
      }

      console.log('Sending request to worker...')
      const workerResponse = await fetch('https://visa-webapp.transytrong20.workers.dev/api/evisa', {
        method: 'POST',
        body: workerFormData
      })

      console.log('Worker response status:', workerResponse.status)
      const responseData = await workerResponse.json() as WorkerResponse
      console.log('Worker response data:', responseData)

      if (!workerResponse.ok) {
        throw new Error(responseData.error || 'Failed to save data')
      }

      // Get image URLs from response
      const imageUrls = responseData.data?.image_urls || []
      console.log('Final image URLs:', imageUrls)

      return NextResponse.json({
        success: true,
        imageUrls
      })
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

    console.log('GET request params:', {
      nationality,
      fullName,
      passportNumber,
      dateOfBirth
    })

    if (!nationality || !fullName || !passportNumber || !dateOfBirth) {
      console.log('GET validation failed:', {
        nationality: !nationality,
        fullName: !fullName,
        passportNumber: !passportNumber,
        dateOfBirth: !dateOfBirth
      })
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
    console.log('Sending request to worker:', workerUrl)
    
    const response = await fetch(workerUrl)
    console.log('Worker response status:', response.status)
    const data = await response.json() as WorkerResponse
    console.log('Worker response data:', data)

    if (!response.ok) {
      const errorMessage = typeof data === 'object' && data && 'error' in data
        ? String(data.error)
        : 'Failed to check visa'
      throw new Error(errorMessage)
    }

    // Đảm bảo response luôn trả về mảng imageUrls
    if (data.success) {
      const result = {
        success: true,
        message: data.message,
        data: data.data // Pass through the entire data object from worker
      }
      console.log('Final response:', result)
      return NextResponse.json(result)
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