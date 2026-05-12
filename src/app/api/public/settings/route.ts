import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function GET() {
  try {
    await dbConnect();
    // Fetch the first admin's info as company settings
    const admin = await Admin.findOne({ role: 'superadmin' }) || await Admin.findOne();
    
    if (!admin) {
      // Fallback defaults if no admin exists yet
      return NextResponse.json({
        name: "Green Hopper Events",
        email: "info@greenhopperevents.com",
        phoneNumber: "+91 000 000 0000",
        address: "Kerala, India",
        socials: {
          instagram: "https://www.instagram.com/greenhoppereventsindia",
          youtube: "https://www.youtube.com/@GreenHopperEvents"
        }
      }, { status: 200 });
    }

    return NextResponse.json({
      name: "Green Hopper Events",
      email: admin.email,
      phoneNumber: (admin as any).phoneNumber || "+91 000 000 0000",
      address: "Kerala, India",
      socials: {
        instagram: "https://www.instagram.com/greenhoppereventsindia",
        youtube: "https://www.youtube.com/@GreenHopperEvents"
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
