import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock para localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock para sessionStorage
const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock para window.location
Object.defineProperty(window, 'location', {
    value: {
        href: 'http://localhost:3000',
        reload: vi.fn(),
        assign: vi.fn(),
    },
    writable: true,
})

// Mock para react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        useLocation: () => ({ pathname: '/' }),
        BrowserRouter: ({ children }) => children,
    }
})

vi.mock('../lib/supabase.js', () => {
    const createChainableMock = (finalData = [], finalError = null) => {
        const mock = {
            select: vi.fn(() => mock),
            from: vi.fn(() => mock),
            insert: vi.fn(() => mock),
            update: vi.fn(() => mock),
            delete: vi.fn(() => mock),
            upsert: vi.fn(() => mock),
            eq: vi.fn(() => mock),
            neq: vi.fn(() => mock),
            gt: vi.fn(() => mock),
            gte: vi.fn(() => mock),
            lt: vi.fn(() => mock),
            lte: vi.fn(() => mock),
            like: vi.fn(() => mock),
            ilike: vi.fn(() => mock),
            is: vi.fn(() => mock),
            in: vi.fn(() => mock),
            contains: vi.fn(() => mock),
            containedBy: vi.fn(() => mock),
            rangeGt: vi.fn(() => mock),
            rangeGte: vi.fn(() => mock),
            rangeLt: vi.fn(() => mock),
            rangeLte: vi.fn(() => mock),
            rangeAdjacent: vi.fn(() => mock),
            overlaps: vi.fn(() => mock),
            textSearch: vi.fn(() => mock),
            match: vi.fn(() => mock),
            not: vi.fn(() => mock),
            or: vi.fn(() => mock),
            filter: vi.fn(() => mock),
            order: vi.fn(() => mock),
            limit: vi.fn(() => mock),
            range: vi.fn(() => mock),
            single: vi.fn(() => Promise.resolve({
                data: Array.isArray(finalData) ? (finalData.length > 0 ? finalData[0] : null) : finalData,
                error: finalError
            })),
            maybeSingle: vi.fn(() => Promise.resolve({
                data: Array.isArray(finalData) ? (finalData.length > 0 ? finalData[0] : null) : finalData,
                error: finalError
            })),
            then: vi.fn((resolve) => resolve({ data: finalData, error: finalError })),
        }

        return mock
    }

    return {
        supabase: {
            auth: {
                getUser: vi.fn(() => Promise.resolve({
                    data: { user: { id: '1', email: 'profesor@test.com' } },
                    error: null
                })),
                signOut: vi.fn(() => Promise.resolve({ error: null })),
                signInWithPassword: vi.fn(() => Promise.resolve({
                    data: {
                        user: { id: '1', email: 'test@example.com' },
                        session: { access_token: 'fake-token' }
                    },
                    error: null
                })),
            },
            from: vi.fn((table) => {
                // Datos mock por defecto para diferentes tablas
                const mockData = {
                    profesores: [
                        { id: 1, nombre: 'Ana', apellido: 'García', correo: 'ana@test.com' },
                        { id: 2, nombre: 'Carlos', apellido: 'López', correo: 'carlos@test.com' }
                    ],
                    estudiantes: [
                        { id: 1, nombre: 'Juan', apellido: 'Pérez', correo: 'juan@test.com' },
                        { id: 2, nombre: 'María', apellido: 'González', correo: 'maria@test.com' }
                    ],
                    talleres: [
                        { id: 1, nombre: 'Taller de React', descripcion: 'Aprender React' },
                        { id: 2, nombre: 'Taller de Node.js', descripcion: 'Aprender Node.js' }
                    ],
                    Taller: [
                        { id: 1, nombre: 'Taller de React', descripcion: 'Aprender React' },
                        { id: 2, nombre: 'Taller de Node.js', descripcion: 'Aprender Node.js' }
                    ],
                    TallerParticipante: [
                        { id: 1, taller_id: 1, usuario_id: 1 },
                        { id: 2, taller_id: 2, usuario_id: 1 }
                    ],
                    usuarios: [
                        { id_usuario: 1, correo: 'profesor@test.com', rol: 'PROFESOR' }
                    ],
                    Usuario: [
                        { id_usuario: 1, correo: 'profesor@test.com', rol: 'PROFESOR', nombre: 'Test', apellido: 'User', estado: 'ACTIVO' },
                        { id_usuario: 2, correo: 'test@example.com', rol: 'PROFESOR', nombre: 'Test', apellido: 'User', estado: 'ACTIVO' }
                    ],
                    Evidencia: [
                        { id: 1, nombre: 'Evidencia 1', descripcion: 'Test evidencia' }
                    ],
                    Inscripcion: [
                        { id_usuario: 1, id_taller: 1, estado: 'INSCRITO' },
                        { id_usuario: 2, id_taller: 1, estado: 'INSCRITO' }
                    ],
                    Reporte: [],
                    reportes: []
                }

                return createChainableMock(mockData[table] || [], null)
            }),
        },
    }
})

// Mock para react-toastify
vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },
    ToastContainer: () => null,
}))
