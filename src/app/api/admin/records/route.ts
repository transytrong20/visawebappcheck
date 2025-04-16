import { NextResponse } from 'next/server';

interface WorkerResponse {
  success: boolean;
  message: string;
  records: Array<{
    id: number;
    nationality: string;
    full_name: string;
    passport_number: string;
    date_of_birth: string;
    image_urls: string[];
  }>;
}

export async function GET() {
  try {
    // Call worker API to get all records
    const response = await fetch('https://visa-webapp.transytrong20.workers.dev/api/records', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`).toString('base64'),
      },
    });

    console.log('Worker response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Worker error response:', errorData);
      throw new Error(`Failed to fetch records: ${errorData}`);
    }

    const data = await response.json() as WorkerResponse;
    console.log('Worker response data:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch records from worker');
    }

    // Transform the data to match the expected format
    const records = Array.isArray(data.records) ? data.records : [];

    return NextResponse.json({
      success: true,
      records: records
    });
  } catch (error) {
    console.error('Error fetching records:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to fetch records'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get form data from the request
    const formData = await request.formData();
    
    // Forward the request to the worker API
    const response = await fetch('https://visa-webapp.transytrong20.workers.dev/api/evisa', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`).toString('base64'),
      },
      body: formData, // Forward the form data as is
    });

    console.log('Worker response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Worker error response:', errorData);
      throw new Error(`Failed to create record: ${errorData}`);
    }

    const data = await response.json();
    console.log('Worker response data:', data);

    return NextResponse.json({
      success: true,
      message: 'Record created successfully'
    });
  } catch (error) {
    console.error('Error creating record:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create record'
      },
      { status: 500 }
    );
  }
} 