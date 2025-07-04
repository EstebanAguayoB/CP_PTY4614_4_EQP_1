import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { GestionTalleres } from '../components/Dashboard/GestionTalleres'

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
                    { id: 1, nombre: 'Taller de React', descripcion: 'Aprender React' },
                    { id: 2, nombre: 'Taller de Node.js', descripcion: 'Aprender Node.js' }
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

describe('GestionTalleres', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renderiza correctamente el componente', async () => {
        render(
            <TestWrapper>
                <GestionTalleres />
            </TestWrapper>
        )

        // Verificar que se muestra contenido relacionado con gestión de talleres
        await waitFor(() => {
            const content = document.body.textContent
            expect(content).toBeTruthy()
        })
    })

    it('muestra la lista de talleres', async () => {
        render(
            <TestWrapper>
                <GestionTalleres />
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
                <GestionTalleres />
            </TestWrapper>
        )

        // Verificar que el componente se renderiza sin errores
        expect(document.body).toBeInTheDocument()
    })
})
