// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import { UserQueries } from '@/lib/db/queries/users.js';
import { AuthValidators } from '@/lib/validators/auth.js';

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Validate input
        const validation = AuthValidators.validateRegister(body);
        if (!validation.isValid) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Validation failed',
                    errors: validation.errors 
                },
                { status: 400 }
            );
        }
        
        // Check if user already exists
        const existingUser = await UserQueries.findByEmail(body.email);
        if (existingUser) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'User with this email already exists' 
                },
                { status: 409 }
            );
        }
        
        // Create user
        const newUser = await UserQueries.create({
            name: body.name,
            email: body.email,
            password: body.password,
            role: 'author' // Default role
        });
        
        return NextResponse.json({
            success: true,
            message: 'Registration successful',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: 'author'
            }
        }, { status: 201 });
        
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Registration failed',
                message: error.message 
            },
            { status: 500 }
        );
    }
}