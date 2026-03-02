// app/api/packages/countries/[countryId]/route.js
import { NextResponse } from 'next/server';
import { PackageQueries } from '@/lib/db/queries/packages.js';
import { CountryQueries } from '@/lib/db/queries/countries.js';
import { ApiResponse } from '@/lib/utils/response.js';

// GET /api/packages/countries/[countryId] - Public
export async function GET(request, { params }) {
    try {
        const { countryId } = await params;
        const { searchParams } = new URL(request.url);
        
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const featured = searchParams.get('featured') === 'true';
        
        // Get country info
        let country;
        if (isNaN(parseInt(countryId))) {
            country = await CountryQueries.findBySlug(countryId);
        } else {
            country = await CountryQueries.findById(parseInt(countryId));
        }
        
        if (!country) {
            return ApiResponse.notFound('Country not found');
        }
        
        const result = await PackageQueries.findByCountry(country.id, {
            page,
            limit,
            featured
        });
        
        return ApiResponse.success({
            country: {
                id: country.id,
                name: country.name,
                slug: country.slug
            },
            packages: result.packages,
            pagination: result.pagination
        });
        
    } catch (error) {
        console.error('Error in GET /api/packages/countries/[countryId]:', error);
        return ApiResponse.error(error.message, 500);
    }
}