import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Error handling middleware
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: isDevelopment ? err.errors : undefined,
    });
  }
  
  const status = err.status || err.statusCode || 500;
  const message = isDevelopment ? err.message : 'Internal server error';
  
  res.status(status).json({ message });
}

// Request validation middleware
export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Resource ownership middleware
export function requireOwnership(resourceType: 'product' | 'order' | 'cart') {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceId = parseInt(req.params.id);
      const userId = (req as any).session?.userId;
      
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // Add ownership validation logic based on resource type
      // This would need to be implemented with your storage layer
      
      next();
    } catch (error) {
      next(error);
    }
  };
}

// CORS configuration
export const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with your actual domain
    : ['http://localhost:5000', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
};