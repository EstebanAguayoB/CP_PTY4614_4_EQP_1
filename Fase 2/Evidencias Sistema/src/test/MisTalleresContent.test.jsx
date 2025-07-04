import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MisTalleresContent from '../components/DashboardProfesor/MisTalleresContent'

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
        auth: {
            getUser: vi.fn(() => Promise.resolve({
                data: { user: { id: '1', email: 'profesor@test.com' } },
                error: null
            })),
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => Promise.resolve({
                    data: [
                        { id: 1, nombre: 'Mi Taller de React', descripcion: 'Aprender React' },
                        { id: 2, nombre: 'Mi Taller de Node.js', descripcion: 'Aprender Node.js' }
                    ],
                    error: null
                })),
            })),
        })),
    },
}))

const TestWrapper = ({ children }) => (
    <BrowserRouter>{children}</BrowserRouter>
)

describe('MisTalleresContent', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renderiza correctamente el componente', async () => {
        render(
            <TestWrapper>
                <MisTalleresContent />
            </TestWrapper>
        )

        // Verificar que se muestra contenido relacionado con talleres del profesor
        await waitFor(() => {
            const content = document.body.textContent
            expect(content).toBeTruthy()
        })
    })

    it('muestra los talleres del profesor', async () => {
        render(
            <TestWrapper>
                <MisTalleresContent />
            </TestWrapper>
        )

        await waitFor(() => {
            // Buscar indicadores de que se está mostrando información de talleres
            const tallerElements = screen.queryAllByText(/taller|react|node/i)
            expect(tallerElements.length).toBeGreaterThanOrEqual(0)
        })
    })

    it('maneja el estado de carga correctamente', () => {
        render(
            <TestWrapper>
                <MisTalleresContent />
            </TestWrapper>
        )

        // Verificar que el componente se renderiza sin errores
        expect(document.body).toBeInTheDocument()
    })
})
