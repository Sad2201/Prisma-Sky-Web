// app/api/contact/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'

// ============================================================
// 1. ESQUEMA DE VALIDACIÓN CON ZOD
// ============================================================

const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    .max(100, { message: 'El nombre es demasiado largo' })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
      message: 'El nombre solo debe contener letras y espacios'
    }),

  email: z
    .string()
    .email({ message: 'Email inválido' })
    .max(100, { message: 'El email es demasiado largo' })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: 'Formato de email inválido'
    }),

  company: z
    .string()
    .min(2, { message: 'El nombre de la empresa es requerido' })
    .max(100, { message: 'El nombre de la empresa es demasiado largo' }),

  service: z
    .enum(['development', 'content', 'automation'], {
      message: 'Servicio inválido'
    }),

  budget: z
    .enum(['2k-5k', '5k-10k', '10k+'], {
      message: 'Rango de presupuesto inválido'
    }),

  message: z
    .string()
    .min(10, { message: 'El mensaje debe tener al menos 10 caracteres' })
    .max(2000, { message: 'El mensaje es demasiado largo (máx 2000 caracteres)' }),

  acceptTerms: z
    .boolean()
    .refine(val => val === true, { message: 'Debes aceptar los términos' })
})

type ContactData = z.infer<typeof contactSchema>

// ============================================================
// 2. SIMULACIÓN DE INTEGRACIÓN CON CRM
// ============================================================

interface CRMService {
  createLead(data: ContactData): Promise<{ id: string; createdAt: string }>
}

class MockCRMService implements CRMService {
  async createLead(data: ContactData): Promise<{ id: string; createdAt: string }> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(7)}`

    console.log('[CRM] Lead creado:', {
      id: leadId,
      ...data,
      timestamp: new Date().toISOString(),
      source: 'prismasky-web'
    })

    return {
      id: leadId,
      createdAt: new Date().toISOString()
    }
  }
}

interface NotificationService {
  sendNotification(data: ContactData): Promise<void>
}

class EmailNotificationService implements NotificationService {
  async sendNotification(data: ContactData): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))

    console.log('[Email] Notificación enviada a:', {
      to: 'team@prismasky.com',
      subject: 'Nuevo lead calificado',
      body: `
        Nombre: ${data.name}
        Email: ${data.email}
        Empresa: ${data.company}
        Servicio: ${data.service}
        Presupuesto: ${data.budget}
        Mensaje: ${data.message}
      `
    })
  }
}

// ============================================================
// 3. SECURITY HEADERS
// ============================================================

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}

// ============================================================
// 4. RATE LIMITING EN MEMORIA
// ============================================================

const rateLimit = new Map<string, { count: number; resetAt: number }>()

const isRateLimited = (ip: string): boolean => {
  const now = Date.now()
  const limit = rateLimit.get(ip)

  if (!limit) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 })
    return false
  }

  if (now > limit.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 })
    return false
  }

  if (limit.count >= 5) {
    return true
  }

  limit.count++
  rateLimit.set(ip, limit)
  return false
}

// ============================================================
// 5. HANDLER PRINCIPAL - COMPLETO Y CORREGIDO
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // Obtener IP correctamente en Edge Runtime
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'

    // Rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Demasiadas solicitudes. Por favor, espera un momento.'
        },
        {
          status: 429,
          headers: {
            ...securityHeaders,
            'Retry-After': '60'
          }
        }
      )
    }

    // Parsear y validar el body
    let rawBody: unknown
    try {
      rawBody = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Body inválido' },
        { status: 400, headers: securityHeaders }
      )
    }

    // Validar con Zod
    const validationResult = contactSchema.safeParse(rawBody)

    if (!validationResult.success) {
      // ✅ CORREGIDO: Usar 'issues' en lugar de 'errors' para Zod v3+
      const errors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }))

      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: errors
        },
        { status: 400, headers: securityHeaders }
      )
    }

    const validatedData = validationResult.data

    // Verificar spam (trampa simple)
    if (validatedData.message.includes('http') || validatedData.message.includes('www.')) {
      return NextResponse.json(
        { success: false, error: 'Mensaje inválido' },
        { status: 400, headers: securityHeaders }
      )
    }

    // Procesar en servicios
    const crmService = new MockCRMService()
    const notificationService = new EmailNotificationService()

    const [leadResult] = await Promise.all([
      crmService.createLead(validatedData),
      notificationService.sendNotification(validatedData)
    ])

    // Limpiar rate limiting en éxito
    rateLimit.delete(ip)

    // Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        data: {
          id: leadResult.id,
          createdAt: leadResult.createdAt,
          message: 'Postulación recibida exitosamente'
        }
      },
      {
        status: 200,
        headers: {
          ...securityHeaders,
          'Cache-Control': 'private, no-cache, no-store, must-revalidate'
        }
      }
    )

  } catch (error) {
    console.error('[API] Error inesperado:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      {
        status: 500,
        headers: {
          ...securityHeaders,
          'Cache-Control': 'private, no-cache, no-store, must-revalidate'
        }
      }
    )
  }
}

// ============================================================
// 6. CONFIGURACIÓN DE EDGE RUNTIME
// ============================================================

export const runtime = 'edge'
export const preferredRegion = 'auto'
export const maxDuration = 10