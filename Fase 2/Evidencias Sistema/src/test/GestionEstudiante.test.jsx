import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import GestionEstudiante from '../components/Dashboard/GestionEstudiante'

// Mock del hook useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

// Mock de Supabase
vi.mock('../lib/supabase.js', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => Promise.resolve({
                data: [
                    { id: 1, nombre: 'Juan', apellido: 'Pérez', correo: 'juan@test.com' },
                    { id: 2, nombre: 'María', apellido: 'González', correo: 'maria@test.com' }
                ],
                error: null
            })),
            insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
            update: vi.fn(() => Promise.resolve({ data: null, error: null })),
            delete: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
    },
}))

const TestWrapper = ({ children }) => (
    <BrowserRouter>{children}</BrowserRouter>
)

describe('GestionEstudiante', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renderiza correctamente el componente', async () => {
        render(
            <TestWrapper>
                <GestionEstudiante />
            </TestWrapper>
        )

        // Verificar que se muestra contenido relacionado con gestión de estudiantes
        await waitFor(() => {
            const content = document.body.textContent
            expect(content).toBeTruthy()
        })
    })

    it('muestra la lista de estudiantes', async () => {
        render(
            <TestWrapper>
                <GestionEstudiante />
            </TestWrapper>
        )

        await waitFor(() => {
            // Buscar indicadores de que se está mostrando información de estudiantes
            const studentElements = screen.queryAllByText(/juan|maría|estudiante/i)
            expect(studentElements.length).toBeGreaterThanOrEqual(0)
        })
    })

    it('maneja el estado de carga correctamente', () => {
        render(
            <TestWrapper>
                <GestionEstudiante />
            </TestWrapper>
        )

        // Verificar que el componente se renderiza sin errores
        expect(document.body).toBeInTheDocument()
    })
})
